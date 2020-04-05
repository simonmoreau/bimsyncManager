import { Component } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { SelectionModel } from '@angular/cdk/collections';
import { PropertyTreeService } from './property-tree.service';
import { PropertyNode } from './property-tree.model';
import { SelectedPropertiesService } from '../selected-properties.service';
import { DisplayedQuantityProperty } from '../selected-properties.model';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

/** Flat to-do item node with expandable and level information */
export class PropertyFlatNode {
  expandable: boolean;
  name: string;
  level: number;
  property: DisplayedQuantityProperty;
}

@Component({
  selector: 'app-property-tree',
  templateUrl: './property-tree.component.html',
  styleUrls: ['./property-tree.component.scss']
})

export class PropertyTreeComponent {

  /** The selection for checklist */
  checklistSelection = new SelectionModel<PropertyFlatNode>(true /* multiple */);

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<PropertyNode, PropertyFlatNode>();

  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<PropertyFlatNode, PropertyNode>();

  treeControl: FlatTreeControl<PropertyFlatNode>;

  treeFlattener: MatTreeFlattener<PropertyNode, PropertyFlatNode>;

  dataSource: MatTreeFlatDataSource<PropertyNode, PropertyFlatNode>;

  loading: boolean;

  linkedListsIds: string[] = ['selectedPropsId', 'filteredPropsId'];

  constructor(private propertyTreeService: PropertyTreeService, private selectedPropertiesService: SelectedPropertiesService) {

    this.loading = true;

    this.treeControl = new FlatTreeControl<PropertyFlatNode>(node => node.level, node => node.expandable);
    this.treeFlattener = new MatTreeFlattener(this.transformFunction, this.getLevel, this.isExpandable, this.getChildren);

    this.dataSource = new MatTreeFlatDataSource<PropertyNode, PropertyFlatNode>(this.treeControl, this.treeFlattener);

    propertyTreeService.dataChange.subscribe(data => {
      this.dataSource.data = data;
    });

    propertyTreeService.loading.subscribe(l => this.loading = l);

    selectedPropertiesService.ValueProperties.propertiesListChange.subscribe(valueProperties => {
      this.UpdateTreeSelection(valueProperties);
    });
  }

  /**
   * Update the selection to match the list of selected properties
   */
  private UpdateTreeSelection(selectedProperties: DisplayedQuantityProperty[]) {

    // get all the nodes in the tree
    const nodes: PropertyNode[] = Array.from(this.nestedNodeMap.keys());
    // Check if these nodes must be selected
    nodes.forEach((node: PropertyNode) => {
      const flatNode = this.nestedNodeMap.get(node);
      const indexInSelectedProps = selectedProperties.indexOf(node.property, 0);
      if (indexInSelectedProps !== -1) { // The property must not be selected
        // Toggle it if necessary
        if (!this.checklistSelection.isSelected(flatNode)) {
           this.todoLeafItemSelectionToggle(flatNode);
          }
      } else { // The property must be selected
        // Toggle it if necessary
        if (this.checklistSelection.isSelected(flatNode)) {
          this.todoLeafItemSelectionToggle(flatNode);
        }
      }
    });
  }

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  private transformFunction = (node: PropertyNode, level: number): PropertyFlatNode => {
    const existingNode: PropertyFlatNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.name === node.name
      ? existingNode
      : new PropertyFlatNode();
    flatNode.name = node.name;
    flatNode.level = level;
    flatNode.expandable = !!node.children;
    flatNode.property = node.property;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }


  hasChild = (_: number, node: PropertyFlatNode): boolean => node.expandable;

  getLevel = (node: PropertyFlatNode): number => node.level;

  isExpandable = (node: PropertyFlatNode): boolean => node.expandable;

  getChildren = (node: PropertyNode): PropertyNode[] => node.children;

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: PropertyFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: PropertyFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: PropertyFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    if (this.checklistSelection.isSelected(node)) {
      descendants.forEach(child =>
        this.selectedPropertiesService.ValueProperties.insertItem(child.property)
      );
    } else {
      descendants.forEach(child =>
        this.selectedPropertiesService.ValueProperties.removeItem(child.property)
      );
    }

    // Force update for the parent
    descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    this.checkAllParentsSelection(node);
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: PropertyFlatNode): void {
    this.checklistSelection.toggle(node);
    if (this.checklistSelection.isSelected(node)) {
      this.selectedPropertiesService.ValueProperties.insertItem(node.property);
    } else {
      this.selectedPropertiesService.ValueProperties.removeItem(node.property);
    }
    this.checkAllParentsSelection(node);
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: PropertyFlatNode): void {
    let parent: PropertyFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: PropertyFlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  /* Get the parent node of a node */
  getParentNode(node: PropertyFlatNode): PropertyFlatNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  public drop(event: CdkDragDrop<DisplayedQuantityProperty[]>) {

  }

}



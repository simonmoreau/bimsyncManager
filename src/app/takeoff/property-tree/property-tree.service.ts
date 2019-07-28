import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BimsyncService } from 'src/app/bimsync/bimsync.service';
import { PropertyNode } from './property-tree.model';
import { SelectedPropertiesService } from '../selected-properties.service';
import { Property } from '../selected-properties.model';

@Injectable({
  providedIn: 'root'
})
export class PropertyTreeService {

  dataChange = new BehaviorSubject<PropertyNode[]>([]);
  loading = new BehaviorSubject<boolean>(false);

  get data(): PropertyNode[] { return this.dataChange.value; }
  get isLoading(): boolean { return this.loading.value; }

  private projectId: string;
  private revisionId: string;
  private ifcType: string;

  constructor(private bimsyncService: BimsyncService,
              private selectedPropertiesService: SelectedPropertiesService) {
  }

  public UpdateProjectId(id: string) {
    this.projectId = id;
  }

  public UpdateRevisionId(id: string) {
    this.revisionId = id;
  }

  public UpdateIfcType(type: string) {
    this.ifcType = type;
    this.initialize();
  }

  initialize() {
    // Notify start of the loading process.
    this.loading.next(true);

    // Build the tree nodes from Json object. The result is a list of `PropertyNode` with nested
    //     file node as children.
    let data = null; // this.buildFileTree(TREE_DATA, 0);

    if (this.projectId && this.revisionId && this.ifcType) {
      this.bimsyncService.listProducts(this.projectId, this.ifcType, this.revisionId).subscribe(products => {

        const nodes: PropertyNode[] = new Array();

        const identificationNode: PropertyNode = new PropertyNode();
        identificationNode.name = 'Identification';
        const identificationChildrenNodes: PropertyNode[] = new Array();
        identificationChildrenNodes.push(this.CreateAChildNode('Name'));
        identificationChildrenNodes.push(this.CreateAChildNode('GUID'));
        identificationChildrenNodes.push(this.CreateAChildNode('Entity'));
        identificationNode.children = identificationChildrenNodes;
        nodes.push(identificationNode);

        const pSet = products[0].propertySets;

        // Create PropertySets nodes
        Object.keys(pSet).forEach(propertySetKey => {
          const node: PropertyNode = new PropertyNode();
          node.name = propertySetKey;
          const childrenNodes: PropertyNode[] = new Array();

          Object.keys(pSet[propertySetKey].properties).forEach(propertyKey => {
            const childrenNode: PropertyNode = new PropertyNode();
            childrenNode.name = propertyKey;
            childrenNode.property = new Property(propertyKey);
            childrenNodes.push(childrenNode);
          });
          node.children = childrenNodes;
          nodes.push(node);
        });

        const qSet = products[0].quantitySets;

        // Create QuantitySets nodes
        Object.keys(qSet).forEach(quantitySetKey => {
          const node: PropertyNode = new PropertyNode();
          node.name = quantitySetKey;
          const childrenNodes: PropertyNode[] = new Array();

          Object.keys(qSet[quantitySetKey].quantities).forEach(propertyKey => {
            const childrenNode: PropertyNode = new PropertyNode();
            childrenNode.name = propertyKey;
            childrenNode.property = new Property(propertyKey);
            childrenNodes.push(childrenNode);
          });
          node.children = childrenNodes;
          nodes.push(node);
        });

        data = nodes;

        // Notify the change.
        this.dataChange.next(data);

        // Notify start of the loading process.
        this.loading.next(false);

      });
    }
  }

  /**
   * Create a children node
   * @param name The name of the children node
   */
  CreateAChildNode(name: string): PropertyNode {
    const childrenNode: PropertyNode = new PropertyNode();
    childrenNode.name = name;
    childrenNode.property = new Property(name);
    return childrenNode;
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `PropertyNode`.
   */
  buildFileTree(obj: { [key: string]: any }, level: number): PropertyNode[] {

    return Object.keys(obj).reduce<PropertyNode[]>((accumulator, key) => {
      const value = obj[key];
      const node: PropertyNode = new PropertyNode();
      node.name = key;

      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.buildFileTree(value, level + 1);
        } else {
          node.name = value;
        }
      }

      return accumulator.concat(node);
    }, []);
  }

  /** Add an item to to-do list */
  insertItem(parent: PropertyNode, Name: string) {
    if (parent.children) {
      parent.children.push({ name: Name } as PropertyNode);
      this.dataChange.next(this.data);
    }
  }

  updateItem(node: PropertyNode, Name: string) {
    node.name = Name;
    this.dataChange.next(this.data);
  }
}

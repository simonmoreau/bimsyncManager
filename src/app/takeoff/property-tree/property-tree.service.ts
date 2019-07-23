import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BimsyncService } from 'src/app/bimsync/bimsync.service';
import { PropertyNode } from './property-tree.model';

/**
 * The Json object for to-do list data.
 */
export const TREE_DATA = {
  Groceries: {
    'Almond Meal flour': null,
    'Organic eggs': null,
    'Protein Powder': null,
    Fruits: {
      Apple: null,
      Berries: ['Blueberry', 'Raspberry'],
      Orange: null
    }
  },
  Reminders: [
    'Cook dinner',
    'Read the Material Design spec',
    'Upgrade Application to Angular'
  ]
};

@Injectable({
  providedIn: 'root'
})
export class PropertyTreeService {

  dataChange = new BehaviorSubject<PropertyNode[]>([]);

  get data(): PropertyNode[] { return this.dataChange.value; }

  private projectId: string;
  private revisionId: string;
  private ifcType: string;

  constructor(private bimsyncService: BimsyncService) {
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
    // Build the tree nodes from Json object. The result is a list of `PropertyNode` with nested
    //     file node as children.
    let data = null; // this.buildFileTree(TREE_DATA, 0);

    if (this.projectId && this.revisionId && this.ifcType) {
      this.bimsyncService.listProducts(this.projectId, this.ifcType, this.revisionId).subscribe(products => {

        const nodes: PropertyNode[] = new Array();

        const pSet = products[0].propertySets;

        Object.keys(pSet).forEach(propertySetKey => {
          const node: PropertyNode = new PropertyNode();
          node.name = propertySetKey;
          const childrenNodes: PropertyNode[] = new Array();

          Object.keys(pSet[propertySetKey].properties).forEach(propertyKey => {
            const childrenNode: PropertyNode = new PropertyNode();
            childrenNode.name = propertyKey;
            childrenNodes.push(childrenNode);
          });
          node.children = childrenNodes;
          nodes.push(node);
        });

        const qSet = products[0].quantitySets;

        Object.keys(qSet).forEach(propertySetKey => {
          const node: PropertyNode = new PropertyNode();
          node.name = propertySetKey;
          const childrenNodes: PropertyNode[] = new Array();

          Object.keys(qSet[propertySetKey].quantities).forEach(propertyKey => {
            const childrenNode: PropertyNode = new PropertyNode();
            childrenNode.name = propertyKey;
            childrenNodes.push(childrenNode);
          });
          node.children = childrenNodes;
          nodes.push(node);
        });

        data = nodes;

        // Notify the change.
        this.dataChange.next(data);

      });
    }


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

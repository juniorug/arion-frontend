import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as go from 'gojs';

const $ = go.GraphObject.make;

@Component({
  selector: 'app-diagram',
  templateUrl: './diagram.component.html',
  styleUrls: ['./diagram.component.scss']
})
export class DiagramComponent {

  public diagram: go.Diagram = null;

  @Input()
  public model: go.Model;

  /* @Input()
  public selectedKey: string; */

  @Output()
  public nodeClicked = new EventEmitter();


  constructor() {
  }

  public ngAfterViewInit() {
    //console.log("selectedKey: ", this.selectedKey);
    
    this.diagram = $(go.Diagram, 'myDiagramDiv',
      {
        layout:
          $(go.TreeLayout,
            {
              isOngoing: true,
              treeStyle: go.TreeLayout.StyleLastParents,
              arrangement: go.TreeLayout.ArrangementVertical,
              // properties for most of the tree:
              angle: 0,
              layerSpacing: 35,
              // properties for the "last parents":
              alternateAngle: 0,
              alternateLayerSpacing: 35,
              alternateAlignment: go.TreeLayout.AlignmentBus,
              alternateNodeSpacing: 20
            }),
        'undoManager.isEnabled': true
      }
    );

    // define the Node template
    this.diagram.nodeTemplate =
      $(go.Node, 'Auto',
      {
        selectionAdornmentTemplate:
          $(go.Adornment, "Auto",
            $(go.Shape, 'RoundedRectangle',
              { fill: null, stroke: "#00cae3", strokeWidth: 6 ,  margin: new go.Margin(1)},
              new go.Binding("stroke", "color")),
            $(go.Placeholder)
          )  // end Adornment
      },
        // for sorting, have the Node.text be the data.name
        new go.Binding('text', 'name'),
        // bind the Part.layerName to control the Node's layer depending on whether it isSelected
        new go.Binding('layerName', 'isSelected', function(sel) { return sel ? 'Foreground' : ''; }).ofObject(),
        // define the node's outer shape
        $(go.Shape, 'RoundedRectangle',
          {
            name: 'SHAPE', fill: 'lightblue', stroke: null,
            // set the port properties:
            portId: '', fromLinkable: true, toLinkable: true, cursor: 'pointer'
          },
          new go.Binding('fill', '', function(node) {
            // modify the fill based on the tree depth level
            const levelColors = ['#291749', '#482980', '#673ab7', '#9575cd',
              '#c2b0e2', '#f0ebf8', '#ffffff'];
            let color = node.findObject('SHAPE').fill;
            const dia: go.Diagram = node.diagram;
            if (dia && dia.layout.network) {
              dia.layout.network.vertexes.each(function(v: go.TreeVertex) {
                if (v.node && v.node.key === node.data.key) {
                  const level: number = v.level % (levelColors.length);
                  color = levelColors[level];
                }
              });
            }
            return color;
          }).ofObject(),
          new go.Binding("stroke", "isHighlighted", function(h) { return "null" })
            .ofObject(),
        ),
        $(go.Panel, 'Horizontal',
          $(go.TextBlock,
            {  margin: new go.Margin(17, 10, 0, 3), text: 'double_arrow', font: '36pt Material Icons', stroke: 'white'}),
          // define the panel where the text will appear
          $(go.Panel, 'Table',
            {
              maxSize: new go.Size(150, 999),
              margin: new go.Margin(-5, 10, 0, 3),
              defaultAlignment: go.Spot.Left
            },
            $(go.RowColumnDefinition, { column: 2, width: 4 }),
            $(go.TextBlock, { font: '9pt  Segoe UI,sans-serif', stroke: 'white' },
              { row: 0, column: 0 },
              new go.Binding('text', 'key', function(v) { return 'ID: ' + v; })),
            $(go.TextBlock, { font: '9pt  Segoe UI,sans-serif', stroke: 'white' },  // the name
              {
                row: 0, column: 1, columnSpan: 5,
                font: '12pt Segoe UI,sans-serif',
                editable: true, isMultiline: false,
                minSize: new go.Size(10, 16)
              },
              new go.Binding('text', 'name').makeTwoWay()),
            $(go.TextBlock, 'Step: ', { font: '9pt  Segoe UI,sans-serif', stroke: 'white' },
              { row: 1, column: 0 }),
            $(go.TextBlock, { font: '9pt  Segoe UI,sans-serif', stroke: 'white' },
              {
                row: 1, column: 1, columnSpan: 4,
                editable: true, isMultiline: false,
                minSize: new go.Size(10, 14),
                margin: new go.Margin(0, 0, 0, 3)
              },
              new go.Binding('text', 'step').makeTwoWay()),
            $(go.TextBlock, 'Actor:', { font: '9pt  Segoe UI,sans-serif', stroke: 'white' },
              { row: 2, column: 0 }),
            $(go.TextBlock, { font: '9pt  Segoe UI,sans-serif', stroke: 'white' },  // the comments
              {
                row: 2, column: 1, columnSpan: 5,
                font: 'italic 9pt sans-serif',
                wrap: go.TextBlock.WrapFit,
                editable: true,  // by default newlines are allowed
                minSize: new go.Size(10, 14)
              },
              new go.Binding('text', 'owner').makeTwoWay())
          )  // end Table Panel
        )// end Horizontal Panel
      );  // end Node

      /** ADD HIGHLIGHT FOR THE TRACKED ASSET ITEM */
      // Create a part in the background of the full diagram to highlight the selected node
      let highlighter =
        $(go.Part, "Auto",
          {
            layerName: "Background",
            selectable: false,
            isInDocumentBounds: false,
            locationSpot: go.Spot.Center
          },
          $(go.Shape, "Ellipse",
            {
              fill: $(go.Brush, "Radial", { 0.0: "red", 1.0: "green" }),
              stroke: null,
              desiredSize: new go.Size(400, 400)
            })
        );
        this.diagram.add(highlighter);
        // Start by focusing the diagrams on the node at the top of the tree.
      // Wait until the tree has been laid out before selecting the root node.
      this.diagram.addDiagramListener("InitialLayoutCompleted", function(e) {
        var node0 = this?.diagram?.findPartForKey(1);
        if (node0 !== null && node0 !== undefined) node0.isSelected = true;
        //showLocalOnFullClick();
      });


      /** END HIGHLIGHT FOR THE TRACKED ASSET ITEM */

      // when the user clicks on the background of the Diagram, remove all highlighting
  /* this.diagram.click = function(e) {
    e.diagram.commit(function(d) { d.clearHighlighteds(); }, "no highlighteds");
  }; */
    this.diagram.model = this.model;
    //this.diagram.select(this.diagram.findNodeForKey(this.selectedKey));
    //this.nodeClicked.emit(this.diagram.findNodeForKey(this.selectedKey));

    // when the selection changes, emit event to app-component updating the selected node
    this.diagram.addDiagramListener('ChangedSelection', (e) => {
      const node = this.diagram.selection.first();
      this.nodeClicked.emit(node);
    });
  }

}

import CytoscapeComponent from 'react-cytoscapejs';
import './styles.css';


interface GraphVisualizatorProps {
  title: string;
  graphData: Array<any>;
  layoutName: 'concentric' | 'breadthfirst';
  setNodeSelected: (node: string) => void;
}

export function GraphVisualizator({ title, graphData, layoutName, setNodeSelected } : GraphVisualizatorProps) {
  
  return (
    <>
      <div id="menu"> 
        <h1>{ title }</h1>
        <div
          style={{
            border: "1px solid #000",
            backgroundColor: "#f5f6fe",
          }}
        >
          <CytoscapeComponent
            elements={graphData}
            style={{ width: "100%", height: "600px" }}
            layout={{
              name: layoutName,
              fit: true,
              directed: true,
              padding: 50,
              animate: true,
              animationDuration: 1000,
              avoidOverlap: true,
              nodeDimensionsIncludeLabels: true,
            }}
            textureOnViewport={true}
            cy={(cy) => {
              graphData?.forEach(item => {
                cy.elements(`node#${item.data.id}`).css({
                  "width": "40px",
                  "height": "40px",
                  "background-color": "blue",
                  "background-image": "url(" + item.data?.image + ")",
                  "background-fit": "contain",
                });

                cy.elements(`node#${item.data.id}`).addListener('click', () => {
                  console.log(item.data)
                  setNodeSelected(item.data.label);
                });
              });
            }}
            stylesheet={[
              {
                selector: "node",
                style: {
                  "background-color": "#fff",
                  width: 120,
                  height: 120,
                  label: "data(label)",
                  "text-halign": "center",
                  "text-outline-width": "2px",
                  "overlay-padding": "6px",
                },
              },
              {
                selector: "node:selected",
                style: {
                  "border-width": "6px",
                  "border-color": "#000",
                  "background-color": "#77828C",
                  "text-outline-color": "#77828C"
                }
              },
              {
                selector: "label",
                style: {
                  color: "white",
                  width: 30,
                  height: 30,
                }
              },
              {
                selector: "edge",
                style: {
                  width: 1,
                  "line-color": "#000",
                  "target-arrow-color": "#6774cb",
                  "target-arrow-shape": "triangle",
                  "curve-style": "bezier",
                }
              }
            ]}
          />
        </div>
      </div>
    </>
  );
}
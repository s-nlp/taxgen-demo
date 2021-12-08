import { useEffect, useRef } from 'react';
import { DataSet } from 'vis-data';
import { Network } from 'vis-network';

export default function Taxonomy() {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!ref.current) return;
  
      // create an array with nodes
      const nodes = new DataSet<any>([
        { id: 1, label: "Node 1" },
        { id: 2, label: "Node 2" },
        { id: 3, label: "Node 3" },
        { id: 4, label: "Node 4" },
        { id: 5, label: "Node 5" },
      ]);
  
      // create an array with edges
      const edges = new DataSet<any>([
        { from: 1, to: 3 },
        { from: 1, to: 2 },
        { from: 2, to: 4 },
        { from: 2, to: 5 },
        { from: 3, to: 3 },
      ]);
  
      // create a network
      const data = {
        nodes: nodes,
        edges: edges,
      };
      const options = {
        edges: {
            arrows: 'to'
        },
        height: '800px',
        width: '800px'
      };
      const network = new Network(ref.current, data, options);
  
      return () => {
        network.destroy();
      }
    }, []);
  
    return (<div ref={ref}/>);
}

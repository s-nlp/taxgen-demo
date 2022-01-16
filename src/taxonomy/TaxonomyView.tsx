import { useEffect, useRef } from "react";
import { DataSet } from "vis-data";
import { Network } from "vis-network";
import { Taxonomy } from "./TaxonomyDTO";

export interface TaxonomyViewProps {
  taxonomy: Taxonomy;
  navigateToRoot: () => void;
  navigateToWord: (id: string) => void;
  generateWords: () => void;
}

export default function TaxonomyView(props: TaxonomyViewProps) {
    const {taxonomy, navigateToRoot, navigateToWord, generateWords} = props;
    const {currentWord, words, relations} = taxonomy;

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!ref.current) return;
  
      const nodes = new DataSet<any>(
        words.map((w) => {
          return {
            id: w.id,
            label: w.word,
            color: {
              background: (w.id === currentWord) ? '#FF8888' : '#D2E5FF'
            },
            level: w.level
          };
        })
      );
  
      const edges = new DataSet<any>(
        relations.map((r) => {
           return {from: r.parent, to: r.child};
        })
      );
  
      const data = {
        nodes: nodes,
        edges: edges,
      };

      const options = {
        edges: {
            arrows: 'to'
        },
        height: '800px',
        width: '1600px',
        layout: {
          hierarchical: {
            enabled: true,
            direction: 'UD',
            sortMethod: 'directed'
          }
        },
        physics: {
          enabled: false
        },
        interaction: {
          dragNodes :false
        },
        clickToUse: false
      };
      
      const network = new Network(ref.current, data, options);

      network.on('doubleClick', (e) => {
        const id = e.nodes[0];
        if (id !== currentWord) {
          navigateToWord(id);
        } else {
          generateWords();
        }
      });
  
      return () => {
        network.off('hold');
        network.off('doubleClick');
        network.destroy();
      }
    }, [currentWord, words, relations, navigateToWord, generateWords]);
  
    return (<>
      <h1>
        Taxonomy
        <br/>
        <button onClick={navigateToRoot}>Back to root</button>
      </h1>
      <div ref={ref}/>
    </>);
}

import { useEffect, useRef } from "react";
import { DataSet } from "vis-data";
import { Network } from "vis-network/standalone/esm/vis-network";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Taxonomy } from "./TaxonomyDTO";

export interface TaxonomyViewProps {
  taxonomy: Taxonomy;
  navigateToRoot: () => void;
  navigateToWord: (id: string) => void;
  generateWords: (id: string) => void;
  generateRelations: (fromId: string, toId: string) => void;
  regenerateGraph: () => void;
}

export default function TaxonomyView(props: TaxonomyViewProps) {
    const {
      taxonomy,
      navigateToRoot, 
      navigateToWord, 
      generateWords,
      generateRelations,
      regenerateGraph
    } = props;
    const {currentWord, words, relations} = taxonomy;

    const definition = words.filter((w) => w.id === currentWord).map((w) => w.definition)[0];
    const lemmas = words.filter((w) => w.id === currentWord).map((w) => w.lemmas)[0];

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!ref.current) return;
  
      const nodes = new DataSet<any>(
        words.map((w) => {
          return {
            id: w.id,
            label: w.word,
            color: (w.id === currentWord) ? '#8cffdd' : '#ccd1ff',
            level: w.level
          };
        })
      );
  
      const edges = new DataSet<any>(
        relations.map((r) => {
           return {
             id: r.parent + '_' + r.child,
             from: r.parent,
             to: r.child
            };
        })
      );
  
      const data = {
        nodes: nodes,
        edges: edges,
      };

      const options = {
        nodes: {
          borderWidth: 0
        },
        edges: {
            arrows: 'to',
            color: '#3642b3'
        },
        height: '800px',
        width: '100%',
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
          dragNodes: false,
          navigationButtons: true,
          keyboard: true
        },
        clickToUse: false
      };
      
      const network = new Network(ref.current, data, options);

      network.on('doubleClick', (e) => {
        const id = e.nodes[0];
        if (!id) {
          const eid = e.edges[0];
          if (eid) {
            const [fromId, toId] = eid.split("_");
            generateRelations(fromId, toId);
          }
          return;
        }
        if (id !== currentWord) {
          navigateToWord(id);
        } else {
          generateWords(id);
        }
      });
  
      return () => {
        network.off('hold');
        network.off('doubleClick');
        network.destroy();
      }
    }, [currentWord, words, relations, navigateToWord, generateWords, generateRelations]);
  
    return (<>
      <h1>
        Taxonomy
      </h1>
      <Row>
        <Col xs={1}>
          <Button onClick={navigateToRoot}>Back to root</Button>
        </Col>
        <Col xs={1}>
          <Button onClick={regenerateGraph}>Back to original graph</Button>
        </Col>
      </Row>
      <Row>
        <Col xs={9}>
          <div ref={ref}/>
        </Col>
        <Col>
          {currentWord ?
            <Card>
              <Card.Img variant="top" src={`/api/images/${currentWord}.jpg`}/>
              <Card.Body>
                <Card.Title>{currentWord}</Card.Title>
                <Card.Text>
                  {lemmas.join(', ')}
                </Card.Text>
                <Card.Text>
                  {definition}
                </Card.Text>
              </Card.Body>
            </Card>
            :
            <></>
          }
        </Col>
      </Row>
    </>);
}

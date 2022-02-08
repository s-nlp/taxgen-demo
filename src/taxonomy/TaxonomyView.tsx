import { useEffect, useRef, useState } from "react";
import { DataSet } from "vis-data";
import { Network } from "vis-network/standalone/esm/vis-network";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { Taxonomy } from "./TaxonomyDTO";

export interface TaxonomyViewProps {
  taxonomy: Taxonomy;
  navigateToRoot: () => void;
  navigateToWord: (id: string) => void;
  navigateToSearch: (search: string) => void;
  generateWords: (id: string) => void;
  generateRelations: (fromId: string, toId: string) => void;
  regenerateGraph: () => void;
}

export default function TaxonomyView(props: TaxonomyViewProps) {
    const {
      taxonomy,
      navigateToRoot, 
      navigateToWord, 
      navigateToSearch,
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
            color: (w.id === currentWord) ? '#8cffdd' : (w.generated ? '#9effff' : '#ccd1ff'),
            level: w.level
          };
        })
      );
  
      const edges = new DataSet<any>(
        relations.map((r) => {
           return {
             id: r.parent + '$$$' + r.child,
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
            const [fromId, toId] = eid.split('$$$');
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
  
    const [search, setSearch] = useState('');

    return (<>
      <h2>
        <br/>
      WordNet3.0 vizualization for candidate-free taxonomy enrichment
      <br/><br/>
      </h2>
      <Row>
        <Col xs={1}>
          <Button style={{ "backgroundColor": "#008CBA", "borderColor": "#008CBA" } as React.CSSProperties} onClick={navigateToRoot}>Back to root</Button>
        </Col>
        <Col xs={1}>
          <Button style={{ "backgroundColor": "#008CBA", "borderColor": "#008CBA" }as React.CSSProperties} onClick={regenerateGraph}>Reset graph</Button>
        </Col>
        <Col xs={3}>
          <InputGroup className="mb-3">
            <Form.Control type="text" placeholder="word" value={search} onChange={(e) => setSearch(e.target.value)} />
            <Button style={{"backgroundColor": "#008CBA", "borderColor": "#008CBA", "paddingLeft": "10px !important" } as React.CSSProperties} onClick={() => {navigateToSearch(search)}}>Move to</Button>
          </InputGroup>
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

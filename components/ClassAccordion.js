import { Accordion, Card, ListGroup, Button } from "react-bootstrap";

const ClassAccordion = ({ clss, exportSelect }) => {
  return (
    <Accordion defaultActiveKey={0}>
      <Card bg="dark" text="light" border="primary" className="rounded-0 border-0">
        <Accordion.Toggle as={Card.Header}>
          {clss.name}
        </Accordion.Toggle>
      </Card>
      {clss.types && clss.types.map((type, i1) =>
        <ListGroup key={clss.id + i1} className="rounded-0 border-0">
          <Accordion.Toggle as={ListGroup.Item} action className="rounded-0 text-start bg-danger text-light" eventKey={i1 + 1}>
            {type.name.toUpperCase()}
          </Accordion.Toggle>
          <Accordion.Collapse eventKey={i1 + 1}>

            <ListGroup>
              {type.modules && type.modules.map((mod, i2) =>
                <ListGroup.Item key={mod.id + i2} action onClick={() => { exportSelect(mod) }}>{mod.name}</ListGroup.Item>
              )}

            </ListGroup>
          </Accordion.Collapse>
        </ListGroup>
      )
      }
    </Accordion >
  )
}


export default ClassAccordion

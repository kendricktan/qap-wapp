import React, { Component } from 'react'
import { Card, CardTitle, CardText } from 'material-ui/Card'
import { Row, Col } from 'react-flexbox-grid'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'
import { displayEquation, displayMatrix } from '../utils/displayMaths'

const vectorDisplayStyle = {
  textAlign: 'center',
  fontSize: '20px',
  fontFamily: 'monospace',
  whiteSpace: 'pre-wrap'
}

class GatesToR1CSCard extends Component {
  render () {
    return (
      <Card>
        <CardTitle
          title="Gates to R1CS"
          subtitle="Each gate poses as a constraint to the R1CS that our solution needs to satisfy."
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardText expandable={true}>
            The R1CS is a group of 3 vectors <code>A, B, C</code>. And the solution to an R1CS vector is <code>S</code>, where <code>S</code> must satisfy the equation:
          <ul>
            <li><code>(S . A) * (S . B) - (S . C) = 0</code></li>
          </ul>
        </CardText>
        <CardText>
          <Row style={{ fontSize: '25px', textAlign: 'center' }}>
            <Col xs={5}>Vector</Col>
            <Col xs={5}>Expression</Col>
            <Col xs={2}></Col>
          </Row><br />
          <hr />
          <Row middle="xs" style={vectorDisplayStyle}>
            <Col xs={5}>
              <Row>
                <Col xs={3} style={{textAlign: 'right'}}>
                    A =<br/>
                    B =<br/>
                    C =<br/>
                </Col>
                <Col xs={9} style={{textAlign: 'left'}}>
                  { displayMatrix([[1, 2, 3, 4, 5], [6, 7, 8, 9, 10], [11, 12, 13, 14, 15]]) }
                </Col>
              </Row>
            </Col>
            <Col xs={5}>
              {displayEquation('x', '1')} <br />
              {displayEquation('sym_1', 'x + 1')}
            </Col>
            <Col xs={2}>
              <FlatButton label="remove" secondary={true} />
            </Col>
          </Row>
          <hr />
          <Row middle="xs" style={vectorDisplayStyle}>
            <Col xs={5}>
              <Row>
                <Col xs={3} style={{textAlign: 'right'}}>
                    A =<br/>
                    B =<br/>
                    C =<br/>
                </Col>
                <Col xs={9} style={{textAlign: 'left'}}>
                  { displayMatrix([[156, 2, 3, 4, 5], [6, 74, 8, 9, 10], [11, 12, 13, 14, 15]]) }
                </Col>
              </Row>
            </Col>
            <Col xs={5}>
              {displayEquation('x', '2')} <br />
              {displayEquation('A1', '5 * sym_1')}
              {displayEquation('A', '1 + A1')}
              {displayEquation('sym_1', 'A * y')}
            </Col>
            <Col xs={2}>
              <FlatButton label="remove" secondary={true} />
            </Col>
          </Row>
          <hr />
        </CardText>
        <CardText style={{ padding: '5px 50px 5px 50px' }}>
          <TextField
            floatingLabelText="Gate definition"
            hintText="y = 5 * sym_1; sym_2 = y + x"
            errorText=''
            fullWidth={true}
          />
          <FlatButton fullWidth={true} label="Add Gate" primary={true} />
        </CardText>
      </Card>
    )
  }
}

export default GatesToR1CSCard

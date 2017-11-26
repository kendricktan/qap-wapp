import React, { Component } from 'react'
import { CardTitle, CardText } from 'material-ui/Card'
import { Row, Col } from 'react-flexbox-grid'
import { displayEquation, displayMatrix } from '../utils/displayMaths'

const vectorDisplayStyle = {
  textAlign: 'center',
  fontSize: '15px',
  fontFamily: 'monospace',
  whiteSpace: 'pre-wrap'
}

class GatesToR1CSCard extends Component {
  render () {
    const R1CSABCE = this.props.R1CSABCE
    const r1csLength = R1CSABCE[0].length

    return (
      <div>
        <CardTitle
          title="Step 2. Gates to R1CS"
          subtitle="Each gate poses as a constraint to the R1CS that our solution needs to satisfy."
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardText expandable={true}>
          The R1CS is a group of 3 vectors <code>A, B, C</code>. And the solution to an R1CS vector is <code>S</code> (our Evaluation from Step 1), where <code>S</code> must satisfy the equation:
          <ul>
            <li><code>(S . A) * (S . B) - (S . C) = 0</code></li>
          </ul>
        </CardText>
        <CardText>
          <Row style={{ fontSize: '20px', textAlign: 'center' }}>
            <Col xs={6}>R1CS</Col>
            <Col xs={6}>Gates</Col>
          </Row><br />
          <hr />
          {
            // Just need the indexes
            Array.from({length: r1csLength}, (_, i) => i).map((x, idx) => {
              let [A, B, C, E] = [R1CSABCE[0][idx], R1CSABCE[1][idx], R1CSABCE[2][idx], R1CSABCE[3][idx]]

              return (
                <div key={E[0]}>
                  <Row middle="xs" center="xs" style={vectorDisplayStyle}>
                    <Col xs={6}>
                      <Row>
                        <Col xs={3} style={{textAlign: 'right'}}>
                          A =<br/>
                          B =<br/>
                          C =<br/>
                        </Col>
                        <Col xs={9} style={{textAlign: 'left'}}>
                          { displayMatrix([A, B, C]) }
                        </Col>
                      </Row>
                    </Col>
                    <Col xs={6}>
                      { displayEquation(E[0], E[1]) }
                    </Col>
                  </Row>
                  <hr/>
                </div>
              )
            })
          }
        </CardText>
      </div>
    )
  }
}

export default GatesToR1CSCard

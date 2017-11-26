import React, { Component } from 'react'
import { CardTitle, CardText } from 'material-ui/Card'
import { Row, Col } from 'react-flexbox-grid'
import { displayMatrix } from '../utils/displayMaths'
import { r1csToQap } from '../utils/QAP'

const vectorDisplayStyle = {
  textAlign: 'center',
  fontSize: '15px',
  fontFamily: 'monospace',
  whiteSpace: 'pre-wrap'
}

const matrixToFixed = (m, n) => {
  return m.map((x) => {
    return x.map((y) => y.toFixed(2))
  })
}

class R1CSToQAPCard extends Component {
  render () {
    const [A, B, C, E] = this.props.R1CSABCE
    let [Aqap, Bqap, Cqap, Z] = r1csToQap(A, B, C)
    Aqap = matrixToFixed(Aqap)
    Bqap = matrixToFixed(Bqap)
    Cqap = matrixToFixed(Cqap)

    return (
      <div>
        <CardTitle
          title='Step 3. R1CS to QAP'
          subtitle='Converting the R1Cs to QAP allows us to check all of the constraints at the same time.'
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardText expandable={true}>
            This transformation is achieved using <i>Lagrange Interpolation</i>. <a href="https://www.youtube.com/watch?v=vAgKE5wvR4Y">You can find out more about Lagrange Interpolation here.</a>
        </CardText>
        <CardText>
          <Row style={{textAlign: 'center', fontSize: '20px'}}>
            <Col xs={1}></Col>
            <Col xs={5}>R1CS</Col>
            <Col xs={6}>QAP</Col>
          </Row><br/>
          <Row middle="xs" style={vectorDisplayStyle}>
            <Col xs={1} style={{fontSize: '20px'}}>
                A
            </Col>
            <Col xs={5}>
              <Row middle="xs">
                <Col xs={1} style={{fontSize: '60px', textAlign: 'right'}}>[</Col>
                <Col xs={10}>
                  { displayMatrix(A) }
                </Col>
                <Col xs={1} style={{fontSize: '60px', textAlign: 'left'}}>]</Col>
              </Row>
            </Col>
            <Col xs={6}>
              <Row middle="xs">
                <Col xs={1} style={{fontSize: '60px', textAlign: 'right'}}>[</Col>
                <Col xs={10}>
                  { displayMatrix(Aqap) }
                </Col>
                <Col xs={1} style={{fontSize: '60px', textAlign: 'left'}}>]</Col>
              </Row>
            </Col>
          </Row> <br/>
          <Row middle="xs" style={vectorDisplayStyle}>
            <Col xs={1} style={{fontSize: '20px'}}>
                B
            </Col>
            <Col xs={5}>
              <Row middle="xs">
                <Col xs={1} style={{fontSize: '60px', textAlign: 'right'}}>[</Col>
                <Col xs={10}>
                  { displayMatrix(B) }
                </Col>
                <Col xs={1} style={{fontSize: '60px', textAlign: 'left'}}>]</Col>
              </Row>
            </Col>
            <Col xs={6}>
              <Row middle="xs">
                <Col xs={1} style={{fontSize: '60px', textAlign: 'right'}}>[</Col>
                <Col xs={10}>
                  { displayMatrix(Bqap) }
                </Col>
                <Col xs={1} style={{fontSize: '60px', textAlign: 'left'}}>]</Col>
              </Row>
            </Col>
          </Row> <br/>
          <Row middle="xs" style={vectorDisplayStyle}>
            <Col xs={1} style={{fontSize: '20px'}}>
                C
            </Col>
            <Col xs={5}>
              <Row middle="xs">
                <Col xs={1} style={{fontSize: '60px', textAlign: 'right'}}>[</Col>
                <Col xs={10}>
                  { displayMatrix(C) }
                </Col>
                <Col xs={1} style={{fontSize: '60px', textAlign: 'left'}}>]</Col>
              </Row>
            </Col>
            <Col xs={6}>
              <Row middle="xs">
                <Col xs={1} style={{fontSize: '60px', textAlign: 'right'}}>[</Col>
                <Col xs={10} >
                  { displayMatrix(Cqap) }
                </Col>
                <Col xs={1} style={{fontSize: '60px', textAlign: 'left'}}>]</Col>
              </Row>
            </Col>
          </Row>
        </CardText>
      </div>
    )
  }
}

export default R1CSToQAPCard

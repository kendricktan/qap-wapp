import React, { Component } from 'react'
import { CardTitle, CardText } from 'material-ui/Card'
import { createSolutionPolynomials, r1csToQap } from '../utils/QAP'
import { displayMatrix, displayVector } from '../utils/displayMaths'

class QAPSolutionCard extends Component {
  render () {
    return (
      <div>
        <CardTitle
          title='Step 4. Creating a solution for the QAP'
          subtitle='To create a polynomial solution for the QAP, we will need to provide it a witness (also known as a solution vector).'
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardText expandable={true}>
          The witness is simply the assignment to all the variables, including the input, output, and internal variables (according to the variable mapping).<br/>
          Our witness (<code>S</code>) is:<br/>
          <div style={{fontSize: '20px', textAlign: 'center'}}>
            { displayMatrix([this.props.witness], false) }
          </div><br/>
          Our polynomial solution <code>(A . S) * (B . S) - (C . S)</code> in vector format is:<br/>
          <div style={{fontSize: '20px', textAlign: 'center'}}>
            { displayMatrix([this.props.solution], false) }
          </div><br/><br/>
          <code>Z</code> in <code>(A . S) * (B . S) - (C . S) = H * (Z . S)</code>:<br/>
          <div style={{fontSize: '20px', textAlign: 'center'}}>
            { displayMatrix([this.props.Z.map(x => x.toFixed(2))], false) }
          </div><br/><br/>
        </CardText>
      </div>
    )
  }
}

export default QAPSolutionCard

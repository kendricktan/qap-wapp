import React, { Component } from 'react'
import { Card, CardTitle, CardText } from 'material-ui/Card'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'
import { displayVector } from '../utils/displayMaths'

class QAPSolutionCard extends Component {
  render () {
    return (
      <Card>
        <CardTitle
          title='Checking the QAP'
          subtitle='To check if we hold a solution to the QAP, we will need to provide it a solution vector (also known as a witness).'
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardText expandable={true}>
            For more information, check out <a href="https://medium.com/@VitalikButerin/quadratic-arithmetic-programs-from-zero-to-hero-f6d558cea649">Vitalik's post</a> under the section "Checking the QAP".<br/><br/>
            The solution vector is simply the assignment to all the variables, including the input, output, and internal variables (according to the variable mapping).<br/>
            Our solution vector is:<br/>
          <div style={{fontSize: '25px', textAlign: 'center'}}>
            {displayVector([1, 2, 3, 4, 5])}
          </div>
        </CardText>
        <CardText style={{textAlign: 'center'}}>
          <TextField
            floatingLabelText="Solution Vector"
            hintText="[1 2 5 6 8]"
            errorText=''
          /><br/>
          <FlatButton style={{width: '300px'}} label='Check' primary={true} />
        </CardText>
        <CardText style={{textAlign: 'center', fontSize: '20px'}}>
            No remainders found! Solution is valid :-)
        </CardText>
      </Card>
    )
  }
}

export default QAPSolutionCard

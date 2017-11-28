import React, { Component } from 'react'
import { CardTitle, CardText } from 'material-ui/Card'
import { divPoly } from '../utils/QAP'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'

class CheckingSolutionCard extends Component {
  state = {
    vectorTxt: '',
    success: true,
    outputText: ''
  }

  render () {
    return (
      <div>
        <CardTitle
          title='Step 5. Checking the polynomial solution'
          subtitle='The solution is valid for our constructed QAP if it yields no remainder after being divided by Z. You can test a solution against the constructed QAP from above using the tools below:'
        />
        <CardText>
          <h4>Note: Any slight change in the solution WILL make the solution invalid (e.g. rounding to nearest decimal place).</h4>
          <span style={{color: this.state.success ? 'green' : 'red'}}>{ this.state.outputText }</span>
        </CardText>
        <CardText>
          <TextField
            onChange={(e) => this.setState({ vectorTxt: e.target.value })}
            hintText="[-25.0 3.0 5.0 9.0 -5.0]"
            floatingLabelText="Solution Vector: (A. S) * (B. S) - (C . S)"
            fullWidth={true}/><br/>
          <FlatButton
            label="Check Solution"
            primary={true}
            fullWidth={true}
            onClick={() => {
              const sol = this.state.vectorTxt.split(' ').reduce((acc, k) => (isNaN(parseFloat(k)) ? acc : acc.concat(parseFloat(k))), [])
              if (sol.length !== this.props.solution.length) {
                this.setState({
                  success: false,
                  outputText: 'Vector in invalid format/length'
                })
                return
              }
              const [quot, rem] = divPoly(sol, this.props.Z)
              for (let i in rem) {
                if (rem[i] > 10 ** -10) {
                  console.log('[Error] Evaluation (should be 0):', rem[i], ' At index: ', i)
                  this.setState({
                    success: false,
                    outputText: 'Invalid solution, remainder found'
                  })
                  return
                }
              }
              this.setState({
                success: true,
                outputText: 'Solution is valid! :-)'
              })
            }}
          />
        </CardText>
      </div>
    )
  }
}

export default CheckingSolutionCard

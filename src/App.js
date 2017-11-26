import React, { Component } from 'react'
import { Card, CardText } from 'material-ui/Card'
import AppBar from 'material-ui/AppBar'
import FlattenStep from './components/Flatten'
import GatesToR1CSCard from './components/GatesToR1CS'
import QAPSolutionCard from './components/QAPSolution'
import R1CSToQAPCard from './components/R1CSToQAP'
import { parseSymbols, evalSymbolsAt, convertToR1CS } from './utils/parsing'
import './styles/app.css'

const defaultExpression = 'x^3+x+5'
const defaultEvalAt = 3
const defaultSymbols = parseSymbols(defaultExpression)
const defaultEvaluatedSymbols = evalSymbolsAt(defaultEvalAt, defaultSymbols)
const defaultVariableMapping = ['one', 'x', 'out', 'rep_1', 'rep_2', 'rep_3']
const defaultR1CSABCE = convertToR1CS(defaultEvaluatedSymbols, defaultSymbols, defaultVariableMapping)
class App extends Component {
  state = {
    expression: defaultExpression,
    evalAt: defaultEvalAt,
    symbols: defaultSymbols,
    evaluatedSymbols: defaultEvaluatedSymbols,
    variableMapping: ['one', 'x', 'out', 'rep_1', 'rep_2', 'rep_3'],
    R1CSABCE: defaultR1CSABCE // A, B, C, E = (A . S) * (B . S) - (C . S) = 0. E = expression
  }

  setAppState = ({expression, evalAt, symbols, evaluatedSymbols, variableMapping, R1CSABCE}) => {
    this.setState({
      expression: expression || this.state.expression,
      evalAt: evalAt || this.state.evalAt,
      symbols: symbols || this.state.symbols,
      evaluatedSymbols: evaluatedSymbols || this.state.evaluatedSymbols,
      variableMapping: variableMapping || this.state.variableMapping,
      R1CSABCE: R1CSABCE || this.state.R1CSABCE
    })
  }

  setVariableMapping = (vm) => {
    this.setState({
      variableMapping: vm,
      R1CSABCE: convertToR1CS(this.state.evaluatedSymbols, this.state.symbols, vm)
    })
  }

  render () {
    return (
      <div>
        <AppBar
          showMenuIconButton={false}
          title="QAP Playground"
        />
        <div style={{ margin: '20px auto 20px auto', maxWidth: '1000px' }}>
          <Card>
            <CardText>
              <h3>Notice: This playground was created as an education tool to play around with QAPs. Please refer to <a href="https://medium.com/@VitalikButerin/quadratic-arithmetic-programs-from-zero-to-hero-f6d558cea649">Vitalik's post on QAPs</a> for more info (and to understand whats going on in this playground).</h3>
            </CardText>
          </Card> <br/>
          <Card>
            <FlattenStep setAppState={this.setAppState} setVariableMapping={this.setVariableMapping} {...this.state} />
            <GatesToR1CSCard R1CSABCE={this.state.R1CSABCE} />
            <R1CSToQAPCard R1CSABCE={this.state.R1CSABCE} />
            <QAPSolutionCard {...this.state}/>
          </Card>
        </div>
      </div>
    )
  }
}

export default App

import React, { Component } from 'react'
import { Card } from 'material-ui/Card'
import AppBar from 'material-ui/AppBar'
import FlattenStep from './components/Flatten'
import GatesToR1CSCard from './components/GatesToR1CS'
import QAPSolutionCard from './components/QAPSolution'
import R1CSToQAPCard from './components/R1CSToQAP'
import { parseSymbols, evalSymbolsAt } from './utils/parsing'
import './styles/app.css'

const defaultExpression = 'x*x*x+5'
const defaultEvalAt = 3
const defaultSymbols = parseSymbols('x*x*x+5')
const defaultEvaluatedSymbols = evalSymbolsAt(defaultEvalAt, defaultSymbols)
class App extends Component {
  state = {
    expression: defaultExpression,
    evalAt: defaultEvalAt,
    symbols: defaultSymbols,
    evaluatedSymbols: defaultEvaluatedSymbols,
    variableMapping: Object.keys(defaultSymbols).sort()
  }

  setAppState = ({expression, evalAt, symbols, evaluatedSymbols, variableMapping}) => {
    this.setState({
      expression: expression || this.state.expression,
      evalAt: evalAt || this.state.evalAt,
      symbols: symbols || this.state.symbols,
      evaluatedSymbols: evaluatedSymbols || this.state.evaluatedSymbols,
      variableMapping: variableMapping || this.state.variableMapping
    })
  }

  setVariableMapping = (vm) => {
    this.setState({
      variableMapping: vm
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
            <FlattenStep setAppState={this.setAppState} setVariableMapping={this.setVariableMapping} {...this.state} />
            <GatesToR1CSCard/>
          </Card>
        </div>
      </div>
    )
  }
}

export default App

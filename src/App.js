import React, { Component } from 'react'
import { Card, CardText } from 'material-ui/Card'
import AppBar from 'material-ui/AppBar'
import FlattenStep from './components/Flatten'
import GatesToR1CSCard from './components/GatesToR1CS'
import QAPSolutionCard from './components/QAPSolution'
import R1CSToQAPCard from './components/R1CSToQAP'
import CheckingSolutionCard from './components/CheckingSolution'
import { parseSymbols, evalSymbolsAt, convertToR1CS } from './utils/parsing'
import { createSolutionPolynomials, r1csToQap } from './utils/QAP'
import './styles/app.css'
import Logo from './assets/logo.svg'

const defaultExpression = 'x^3+x+5'
const defaultEvalAt = 3
const defaultSymbols = parseSymbols(defaultExpression)
const defaultEvaluatedSymbols = evalSymbolsAt(defaultEvalAt, defaultSymbols)
const defaultVariableMapping = ['one', 'x', 'out', 'rep_1', 'rep_2', 'rep_3']
const defaultR1CSABCE = convertToR1CS(defaultEvaluatedSymbols, defaultSymbols, defaultVariableMapping)
const defaultWitness = defaultVariableMapping.map(x => defaultEvaluatedSymbols[x].toString())
const [Ap, Bp, Cp, Z] = r1csToQap(defaultR1CSABCE[0], defaultR1CSABCE[1], defaultR1CSABCE[2])
const [Apoly, Bpoly, Cpoly, defaultSolution] = createSolutionPolynomials(defaultWitness, Ap, Bp, Cp)

class App extends Component {
  state = {
    expression: defaultExpression,
    evalAt: defaultEvalAt,
    symbols: defaultSymbols,
    evaluatedSymbols: defaultEvaluatedSymbols,
    variableMapping: ['one', 'x', 'out', 'rep_1', 'rep_2', 'rep_3'],
    R1CSABCE: defaultR1CSABCE, // A, B, C, E = (A . S) * (B . S) - (C . S) = 0. E = expression
    witness: defaultWitness,
    solution: defaultSolution,
    Z: Z
  }

  setAppState = ({...state}) => {
    this.setState({
      ...state
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
          title='QAP Playground'
        />
        <div style={{ margin: '20px auto 20px auto', maxWidth: '1000px' }}>
          <Card>
            <CardText>
              <h3>Notice: This playground was created as an education tool to play around with QAPs. Please refer to <a href="https://medium.com/@VitalikButerin/quadratic-arithmetic-programs-from-zero-to-hero-f6d558cea649">Vitalik's post on QAPs</a> for more info.</h3>
            </CardText>
          </Card> <br/>
          <Card>
            <FlattenStep setAppState={this.setAppState} setVariableMapping={this.setVariableMapping} {...this.state} />
            <GatesToR1CSCard R1CSABCE={this.state.R1CSABCE} />
            <R1CSToQAPCard R1CSABCE={this.state.R1CSABCE} />
            <QAPSolutionCard {...this.state}/>
            <CheckingSolutionCard {...this.state}/>
          </Card>
        </div>
      </div>
    )
  }
}

export default App

import React, { Component } from 'react'
import { CardTitle, CardText } from 'material-ui/Card'
import { Row, Col } from 'react-flexbox-grid'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'
import { parseSymbols, evalSymbolsAt } from '../utils/parsing'
import { displayEquation } from '../utils/displayMaths'
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc'

const SortableItem = SortableElement(({value}) => (
  <div style={{
    position: 'relative',
    width: '100%',
    display: 'block',
    padding: 20,
    fontSize: '16px',
    fontFamily: 'monospace',
    whiteSpace: 'pre-wrap',
    backgroundColor: '#FFF',
    borderBottom: '1px solid #EFEFEF',
    boxSizing: 'border-box',
    WebkitUserSelect: 'none',
    height: '10px'
  }}>{value}</div>
))

const SortableList = SortableContainer(({keys, dict}) => {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      maxWidth: '500px',
      margin: '0 auto',
      overflow: 'auto',
      backgroundColor: '#f3f3f3',
      border: '1px solid #EFEFEF',
      borderRadius: 3
    }}>
      {
        keys.map((value, index) => (
          <SortableItem key={`item-${index}`} index={index} value={dict[value]} />
        ))
      }
    </div>
  )
})

class SortableComponent extends Component {
  onSortEnd = ({oldIndex, newIndex}) => {
    this.props.setVariableMapping(arrayMove(this.props.keys, oldIndex, newIndex))
  }

  render () {
    return <SortableList dict={this.props.dict} keys={this.props.keys} onSortEnd={this.onSortEnd} />
  }
}

const vectorDisplayStyle = {
  textAlign: 'center',
  fontSize: '16px',
  fontFamily: 'monospace',
  whiteSpace: 'pre-wrap'
}

const defaultExpression = 'x*x*x+5'
const defaultEvalAt = 5
const defaultSymbols = parseSymbols('x*x*x+5')
const defaultEvaluatedSymbols = evalSymbolsAt(defaultEvalAt, defaultSymbols)

class FlattenStep extends Component {
  state = {
    expression: defaultExpression,
    evalAt: defaultEvalAt,
    symbols: defaultSymbols,
    evaluatedSymbols: defaultEvaluatedSymbols,
    variableMapping: Object.keys(defaultSymbols).sort()
  }

  setVariableMapping = (vm) => {
    this.setState({
      variableMapping: vm
    })
  }

  render () {
    return (
      <div>
        <CardTitle
          title="Step 1. Flattening Expressions and Statements into Gates"
          subtitle="Converts arbitrary statements and expressions into a sequence of statements (a.k.a Logic gates)."
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardText expandable={true}>
          These sequence of statements are of two forms:<br />
          <ul>
            <li>
              <code>x = y</code> (where <code>y</code> can be a variable or a number)
            </li>
            <li>
              <code>x = y (op) z</code> (where <code>op</code> can be +, -, *, / and <code>y</code> and <code>z</code> can be variables, numbers, or sub-expression)
            </li>
          </ul>
        </CardText>
        <CardText>
          <Row middle="xs">
            <Col xs={8}>
              <h3>Polynomial Equation</h3>
              <TextField
                defaultValue={this.state.expression}
                fullWidth={true}
                hintText="x * x^2 + ((x-5) + 10)"
                onChange={(e) => this.setState({ expression: e.target.value })}
              />
            </Col>
            <Col xs={4}>
              <h3>Evaluate when `x` is</h3>
              <TextField
                defaultValue={this.state.evalAt}
                fullWidth={true}
                hintText="10"
                onChange={(e) => this.setState({ evalAt: e.target.value })}
              />
            </Col>
          </Row> <br/>
          <div style={{textAlign: 'center', fontSize: '30px'}}>&#8595;</div>
          <FlatButton
            fullWidth={true}
            label={'Flatten and Evaluate'}
            primary={true}
            onClick={() => {
              const sym = parseSymbols(this.state.expression)
              const evalSym = evalSymbolsAt(parseFloat(this.state.evalAt), sym)
              this.setState({
                evaluatedSymbols: evalSym,
                symbols: sym,
                variableMapping: Object.keys(sym).sort()
              })
            }}
          />
          <div style={{textAlign: 'center', fontSize: '30px'}}>&#8595;</div>
          <Row>
            <Col xs={9}>
              <h3>Flattened</h3>
              <div style={vectorDisplayStyle}>
                <SortableComponent
                  keys={this.state.variableMapping}
                  dict={this.state.variableMapping.reduce((acc, k) => {
                    if (k === 'x') {
                      acc[k] = displayEquation(k, this.state.evaluatedSymbols[k])
                    } else {
                      acc[k] = displayEquation(k, this.state.symbols[k])
                    }
                    return acc
                  }, {})}
                  setVariableMapping={this.setVariableMapping}
                />
              </div>
            </Col>
            <Col xs={3}>
              <h3>Evaluation</h3>
              <div style={vectorDisplayStyle}>
                <SortableComponent
                  keys={this.state.variableMapping}
                  dict={this.state.evaluatedSymbols}
                  setVariableMapping={this.setVariableMapping}
                />
              </div>
            </Col>
          </Row>
        </CardText>
      </div>
    )
  }
}

export default FlattenStep

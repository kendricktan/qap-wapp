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

class FlattenStep extends Component {
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
                defaultValue={this.props.expression}
                fullWidth={true}
                hintText="x * x^2 + ((x-5) + 10)"
                onChange={(e) => this.props.setAppState({ expression: e.target.value })}
              />
            </Col>
            <Col xs={4}>
              <h3>Evaluate when `x` is</h3>
              <TextField
                defaultValue={this.props.evalAt}
                fullWidth={true}
                hintText="10"
                onChange={(e) => this.props.setAppState({ evalAt: e.target.value })}
              />
            </Col>
          </Row> <br/>
          <div style={{textAlign: 'center', fontSize: '30px'}}>&#8595;</div>
          <FlatButton
            fullWidth={true}
            label={'Flatten and Evaluate'}
            primary={true}
            onClick={() => {
              const sym = parseSymbols(this.props.expression)
              const evalSym = evalSymbolsAt(parseFloat(this.props.evalAt), sym)
              this.props.setAppState({
                evaluatedSymbols: evalSym,
                symbols: sym,
                variableMapping: Object.keys(sym).sort()
              })
            }}
          />
          <div style={{textAlign: 'center', fontSize: '30px'}}>&#8595;</div>
          <Row>
            <Col xs={9}>
              <h3>Flattened Gates (Drag and drop to reorder mapping)</h3>
              <div style={vectorDisplayStyle}>
                <SortableComponent
                  keys={this.props.variableMapping}
                  dict={this.props.variableMapping.reduce((acc, k) => {
                    if (k === 'x') {
                      acc[k] = displayEquation(k, this.props.evaluatedSymbols[k])
                    } else {
                      acc[k] = displayEquation(k, this.props.symbols[k])
                    }
                    return acc
                  }, {})}
                  setVariableMapping={this.props.setVariableMapping}
                />
              </div>
            </Col>
            <Col xs={3}>
              <h3>Evaluation</h3>
              <div style={vectorDisplayStyle}>
                <SortableComponent
                  keys={this.props.variableMapping}
                  dict={this.props.evaluatedSymbols}
                  setVariableMapping={this.props.setVariableMapping}
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

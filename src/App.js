import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar'
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';
import FlatButton from 'material-ui/FlatButton';
import Toggle from 'material-ui/Toggle';
import logo from './assets/logo.svg';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import "./styles/app.css"

const data = [
  { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
  { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
];

// Prevents browser from selecting text
// When reorganizing mappings
const noSelectStyle = {
  webkitTouchCallout: 'none', /* iOS Safari */
  webkitUserSelect: 'none', /* Safari */
  khtmlUserSelect: 'none', /* Konqueror HTML */
  mozUserSelect: 'none', /* Firefox */
  msUserSelect: 'none', /* Internet Explorer/Edge */
  userSelect: 'none', /* Non-prefixed version, currently */
  padding: '5px 10px 5px 10px',
  cursor: 'pointer'
}

const vectorDisplayStyle = {
  textAlign: 'center',
  fontSize: '20px',
  fontFamily: 'monospace',
  whiteSpace: 'pre-wrap'
}

const displayVector = (v, spacingNo=1) => {  
  return v.reduce((acc, s, i) => acc + s + ((i === v.length - 1) ? '' : ' '.repeat(spacingNo - (s+'').length + 1)), '[ ') + ' ]'
}

const displayMatrix = (m) => {
  // Pretify vectors to have the same spacing
  // Gets max digit length
  const mdl = m.reduce((a, v) => Math.max(a, v.reduce((b, s) => Math.max(b, (s+'').length), 1)), 1)

  return m.reduce((acc, s) => acc + '\n' + displayVector(s, mdl), '').slice(1)
}

const displayEquation = (a, b) => {
  // Where a = b
  return (
    <Row center='xs' style={{ fontFamily: '"Lucida Console", Monaco, monospace' }}>
      <Col xs={4} style={{ textAlign: 'right' }}>{a}</Col>
      <Col xs={1} style={{ textAlign: 'center' }}>=</Col>
      <Col xs={4} style={{ textAlign: 'left' }}>{b}</Col>
    </Row>
  )
}

class FlattenCard extends Component {
  render() {
    return (
      <Card>
        <CardTitle
          title="Flattening Expressions and Statements into Gates"
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
          <Row>
            <Col xs={5}>
              <div style={{ width: '100%' }}> <TextField style={{ width: '75%' }} hintText="y = x * x" /> <FlatButton style={{ width: '10%' }} label="Remove" secondary={true} /> </div>
              <div style={{ width: '100%' }}> <TextField style={{ width: '75%' }} hintText="y = x * x" /> <FlatButton style={{ width: '10%' }} label="Remove" secondary={true} /> </div>
              <div style={{ width: '100%' }}> <TextField style={{ width: '75%' }} hintText="y = x * x" /> <FlatButton style={{ width: '10%' }} label="Remove" secondary={true} /> </div>
              <br />
              <FlatButton fullWidth={true} label="Add Expression" primary={true} />
            </Col>
            <Col xs={7}>
              <ResponsiveContainer height='100%' width='100%' aspect={4.0 / 3.0}>
                <LineChart data={data}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Legend verticalAlign="top" height={36} />
                  <Line name="pv of pages" type="monotone" dataKey="pv" stroke="#8884d8" />
                  <Line name="uv of pages" type="monotone" dataKey="uv" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </Col>
          </Row>
        </CardText>
      </Card>
    )
  }
}


const SortableItem = SortableElement(({ value }) =>
  <span style={noSelectStyle}>{value}</span>
);

const SortableVector = SortableContainer(({ items }) => {
  return (
    <div>
      [&nbsp;{items.map((value, index) => (
        <SortableItem key={`item-${index}`} index={index} value={value} />
      ))}&nbsp;]
    </div>
  );
});

class VariableMappingCard extends Component {
  state = {
    items: ['out', 'sym_1', 'y', 'sym_2', 'sym_3'],
  };

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState({
      items: arrayMove(this.state.items, oldIndex, newIndex),
    });
  };

  render() {
    return (
      <Card>
        <CardTitle
          title="Variable Mapping"
          subtitle="The sequence of variable mapping defines the layout of vectors used in the R1CS.  (Drag and drop to reorganize and see changes propagate)"
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardText expandable={true}>
          For more information, check out <a href="https://medium.com/@VitalikButerin/quadratic-arithmetic-programs-from-zero-to-hero-f6d558cea649">Vitalik's Post</a> under the section <strong>'Gates to R1CS'</strong>
        </CardText>
        <CardText style={vectorDisplayStyle}>
          <SortableVector items={this.state.items} onSortEnd={this.onSortEnd} axis='x' />          
        </CardText>
      </Card>
    )
  }
}

class GatesToR1CSCard extends Component {
  render() {
    return (
      <Card>
        <CardTitle
          title="Gates to R1CS"
          subtitle="Each gate poses as a constraint to the R1CS that our solution needs to satisfy."
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardText expandable={true}>
          The R1CS is a group of 3 vectors <code>A, B, C</code>. And the solution to an R1CS vector is <code>S</code>, where <code>S</code> must satisfy the equation:
          <ul>
            <li><code>(S . A) * (S . B) - (S . C) = 0</code></li>
          </ul>
        </CardText>
        <CardText>
          <Row style={{ fontSize: '25px', textAlign: 'center' }}>
            <Col xs={5}>Vector</Col>
            <Col xs={5}>Expression</Col>
            <Col xs={2}></Col>
          </Row><br />
          <hr />
          <Row middle="xs" style={vectorDisplayStyle}>
            <Col xs={5}>
              <Row>
                <Col xs={3} style={{textAlign: 'right'}}>
                  A =<br/>
                  B =<br/>
                  C =<br/>
                </Col>
                <Col xs={9} style={{textAlign: 'left'}}>
                  { displayMatrix([[1,2,3,4,5],[6,7,8,9,10],[11,12,13,14,15]]) }
                </Col>                
              </Row>              
            </Col>
            <Col xs={5}>
              {displayEquation('x', '1')} <br />
              {displayEquation('sym_1', 'x + 1')}
            </Col>
            <Col xs={2}>
              <FlatButton label="remove" secondary={true} />
            </Col>
          </Row>
          <hr />
          <Row middle="xs" style={vectorDisplayStyle}>
            <Col xs={5}>
              <Row>
                <Col xs={3} style={{textAlign: 'right'}}>
                  A =<br/>
                  B =<br/>
                  C =<br/>
                </Col>
                <Col xs={9} style={{textAlign: 'left'}}>
                  { displayMatrix([[156,2,3,4,5],[6,74,8,9,10],[11,12,13,14,15]]) }
                </Col>
              </Row>              
            </Col>
            <Col xs={5}>
              {displayEquation('x', '2')} <br />
              {displayEquation('A1', '5 * sym_1')}
              {displayEquation('A', '1 + A1')}
              {displayEquation('sym_1', 'A * y')}
            </Col>
            <Col xs={2}>
              <FlatButton label="remove" secondary={true} />
            </Col>
          </Row>
          <hr />
        </CardText>        
        <CardText style={{ padding: '5px 50px 5px 50px' }}>
          <TextField
            floatingLabelText="Gate definition"
            hintText="y = 5 * sym_1; sym_2 = y + x"
            errorText=''
            fullWidth={true}
          />
          <FlatButton fullWidth={true} label="Add Gate" primary={true} />
        </CardText>
      </Card>
    )
  }
}

class R1CSToQAPCard extends Component {
  render() {
    return (
      <Card>
        <CardTitle
          title='R1CS to QAP'
          subtitle='Converting the R1Cs to QAP allows us to check all of the constraints at the same time.'
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardText expandable={true}>
          This transformation is achieved using <i>Lagrange Interpolation</i>. <a href="https://www.youtube.com/watch?v=vAgKE5wvR4Y">You can find out more about Lagrange Interpolation here.</a>
        </CardText>
        <CardText>
          <Row style={{textAlign: 'center', fontSize: '25px'}}>
            <Col xs={1}></Col>
            <Col xs={5}>R1CS</Col>
            <Col xs={6}>QAP</Col>
          </Row><br/>
          <Row middle="xs" style={vectorDisplayStyle}>
            <Col xs={1} style={{fontSize: '35px'}}>
              A
            </Col>
            <Col xs={5}>
              <Row middle="xs">                
                <Col xs={1} style={{fontSize: '60px', textAlign: 'right'}}>[</Col>
                <Col xs={10}>
                  { displayMatrix([[1596,2,3,4,5],[6,74,8,9,10],[11,12,13,14,15]]) }
                </Col>
                <Col xs={1} style={{fontSize: '60px', textAlign: 'left'}}>]</Col>
              </Row>              
            </Col>
            <Col xs={6}>
              <Row middle="xs">                
                <Col xs={1} style={{fontSize: '60px', textAlign: 'right'}}>[</Col>
                <Col xs={10}>
                  { displayMatrix([[15.22,2.34, 3.45],[62.00,74.88,8.88],[11.12,12.23,13.14]]) }
                </Col>
                <Col xs={1} style={{fontSize: '60px', textAlign: 'left'}}>]</Col>
              </Row>
            </Col>
          </Row>
        </CardText>
        <hr/>
        <CardText>
          <Row bottom="xs">
            <Col xs={4} style={{textAlign: 'center', fontSize: '22px'}}>
              Show me QAP<br/>conversion from R1CS for
            </Col>
            <Col xs={4}>
              <SelectField
                floatingLabelText="Vector">
                <MenuItem value={1} primaryText="A" />
                <MenuItem value={2} primaryText="B" />
                <MenuItem value={3} primaryText="C" />
              </SelectField>
            </Col>
            <Col xs={4}>
              <SelectField
                floatingLabelText="Variable">
                <MenuItem value={1} primaryText="out" />
                <MenuItem value={2} primaryText="sym_1" />
                <MenuItem value={3} primaryText="y" />              
              </SelectField>
            </Col>
          </Row><br/><br/>
          <Row middle="xs" center="xs" style={{fontSize: '25px', fontFamily: 'monospace'}}>
            <Col xs={3}>
              QAP = lagrange
            </Col>
            <Col xs={1} style={{fontSize: '50px'}}>
              (
            </Col>
            <Col xs={7}>
              (1,5),(2,10),(3,5),(1,5),(2,10),(3,5),(1,5),(2,10),(3,5)
            </Col>
            <Col xs={1} style={{fontSize: '50px'}}>
              )
            </Col>
          </Row>
        </CardText>
        <hr/>
        <CardText>
          <Row center="xs">      
            <Col xs={10}>
              <h2>QAP Visualization</h2>
              <ResponsiveContainer height='100%' width='100%' aspect={4.0 / 3.0}>
                <LineChart data={data}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Legend verticalAlign="top" height={36} />
                  <Line name="pv of pages" type="monotone" dataKey="pv" stroke="#8884d8" />
                  <Line name="uv of pages" type="monotone" dataKey="uv" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </Col>
          </Row>
        </CardText>        
      </Card>
    )
  }
}

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

class App extends Component {
  render() {
    return (
      <div>
        <AppBar
          showMenuIconButton={false}
          title="QAP Playground"
        />
        <div style={{ margin: '20px auto 20px auto', maxWidth: '1000px' }}>
          <FlattenCard /> <br />
          <VariableMappingCard /> <br />
          <GatesToR1CSCard /> <br />
          <R1CSToQAPCard /> <br />   
          <QAPSolutionCard /> <br />               
        </div>
      </div>
    );
  }
}

export default App;
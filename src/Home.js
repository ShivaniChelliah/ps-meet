import * as React from 'react';
import { FlexGrid, FlexGridItem } from '../node_modules/baseui/flex-grid';
import { Card, StyledBody, StyledAction } from '../node_modules/baseui/card';
import { Button } from '../node_modules/baseui/button';

const itemProps = {
  backgroundColor: 'mono300',
  height: 'scale3500',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

class Home extends React.Component {
  render() {
    return (
      <React.Fragment>
        <h1>Meeting Rooms</h1>
        <FlexGrid
          flexGridColumnCount={[1, 2, 2, 2]}
          flexGridColumnGap="scale800"
          flexGridRowGap="scale800"
        >
          <FlexGridItem {...itemProps}>
    <Card
              overrides={{ Root: { style: { width: '328px' } } }}
              headerImage={'https://source.unsplash.com/user/erondu/700x400'}
              title="Hall of Justice"
            >

              <StyledAction>
                <Button style={{ width: '100%' }}>Book Now</Button>
              </StyledAction>
            </Card>
          </FlexGridItem>

          <FlexGridItem {...itemProps}><Card
              overrides={{ Root: { style: { width: '328px' } } }}
              headerImage={'https://source.unsplash.com/user/erondu/700x400'}
              title="Daily Planet"
            >
            
              <StyledAction>
                <Button style={{ width: '100%' }}>Book Now</Button>
              </StyledAction>
            </Card>
            </FlexGridItem>

          <FlexGridItem {...itemProps}>
          <Card
              overrides={{ Root: { style: { width: '328px' } } }}
              headerImage={'https://source.unsplash.com/user/erondu/700x400'}
              title="Metropolis"
            >
            
              <StyledAction>
                <Button style={{ width: '100%' }}>Book Now</Button>
              </StyledAction>
            </Card>
          </FlexGridItem>
          
          <FlexGridItem {...itemProps}>
          <Card
              overrides={{ Root: { style: { width: '328px' } } }}
              headerImage={'https://source.unsplash.com/user/erondu/700x400'}
              title="Krypton"
            >
            
              <StyledAction>
                <Button style={{ width: '100%' }}>Book Now</Button>
              </StyledAction>
            </Card>
          </FlexGridItem>
        </FlexGrid>



      </React.Fragment>
    );

  }
}

export default Home;
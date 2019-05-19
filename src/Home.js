import React, { useState } from 'react';
import { FlexGrid, FlexGridItem } from '../node_modules/baseui/flex-grid';
import { Card, StyledBody, StyledAction } from '../node_modules/baseui/card';
import { Button } from '../node_modules/baseui/button';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton,
} from '../node_modules/baseui/modal';
import { StatefulCalendar } from 'baseui/datepicker';
import { Input } from 'baseui/input';

//for date-picker
const selectOverrides = {
  ControlContainer: {
    style: ({ $theme, $isFocused, $isPseudoFocused }) => ({
      backgroundColor:
        $isFocused || $isPseudoFocused
          ? $theme.colors.positive500
          : $theme.colors.positive,
    }),
  },
  OptionContent: {
    style: ({ $theme, $isHighlighted }) => ({
      color: $isHighlighted ? $theme.colors.positive : $theme.colors.foreground,
    }),
  },
};

const arrowBtnOverrides = ({ $theme }) => ({
  ':focus': {
    backgroundColor: $theme.colors.positive500,
    borderRadius: $theme.borders.useRoundedCorners ? $theme.sizing.scale100 : 0,
  },
});


//for flex grid item
const itemProps = {
  backgroundColor: 'mono300',
  height: 'scale3500',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: '' };
  }
  //for modal
  static defaultProps = {
    isInitiallyOpen: false,
  };
  state = {
    isOpen: this.props.isInitiallyOpen
  };

  toggle = (open = !this.state.isOpen) => {
    this.setState({
      isOpen: !!open,
    });
  };

  open = () => {
    this.toggle(true);
  };

  close = () => {
    this.toggle(false);
  };



  render() {

    return (
      <React.Fragment>

        {/*modal upon "Book Now" button click*/}
        <Modal onClose={this.close} isOpen={this.state.isOpen}>
          <ModalHeader>Book Now</ModalHeader>
          <ModalBody>

            <StatefulCalendar
              initialState={{ value: new Date() }}
              overrides={{
                CalendarHeader: {
                  style: ({ $theme }) => ({
                    backgroundColor: $theme.colors.positive,
                  }),
                },
                MonthSelect: {
                  props: { overrides: selectOverrides },
                },
                YearSelect: {
                  props: { overrides: selectOverrides },
                },
                PrevButton: {
                  style: arrowBtnOverrides,
                },
                NextButton: {
                  style: arrowBtnOverrides,
                },
                Day: {
                  style: ({ $theme, $selected, $isHovered, $isHighlighted }) => ({
                    backgroundColor: $selected
                      ? $theme.colors.positive
                      : $isHovered || $isHighlighted
                        ? $theme.colors.positive100
                        : 'transparent',
                  }),
                },
              }}
            />

            <Input
              onChange={event => this.setState({ value: event.target.value })}
              placeholder="Subject of Meeting"
              value={this.state.value}
            />
          </ModalBody>
          <ModalFooter>
            <ModalButton onClick={this.close}>Cancel</ModalButton>
            <ModalButton onClick={this.close}>Okay</ModalButton>
          </ModalFooter>
        </Modal>

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
                <Button onClick={this.open} style={{ width: '100%' }}>Book Now</Button>
              </StyledAction>
            </Card>
          </FlexGridItem>

          <FlexGridItem {...itemProps}><Card
            overrides={{ Root: { style: { width: '328px' } } }}
            headerImage={'https://source.unsplash.com/user/erondu/700x400'}
            title="Daily Planet"
          >

            <StyledAction>
              <Button onClick={this.open} style={{ width: '100%' }}>Book Now</Button>
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
                <Button onClick={this.open} style={{ width: '100%' }}>Book Now</Button>
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
                <Button onClick={this.open} style={{ width: '100%' }}>Book Now</Button>
              </StyledAction>
            </Card>
          </FlexGridItem>
        </FlexGrid>



      </React.Fragment>
    );

  }

}

export default Home;
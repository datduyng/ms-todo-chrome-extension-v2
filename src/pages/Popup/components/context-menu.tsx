import * as React from 'react';

interface Props {
  menu: any;
  children: React.ReactElement;
  style: any;
  onRightClick: (event: MouseEvent) => any;
}

interface State {
  open: boolean;
  location: {
    x: number;
    y: number;
  };
}

export default class ContextMenu extends React.Component<Props, State> {
  menuRef: HTMLDivElement | null = null;

  state: State = {
    open: false,
    location: {
      x: 0,
      y: 0,
    },
  };

  componentDidMount() {
    document.addEventListener('click', this.onClickOff);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onClickOff);
  }

  onClickOff = (event: MouseEvent) => {
    if (
      this.menuRef !== null 
      && event.target !== this.menuRef
      // && !this.menuRef.contains(event.target as Node)
    ) {
      this.setState({
        open: false,
      });
    }
  };

  onRightClick = (x: number, y: number) => {
    this.setState(() => ({
      open: true,
      location: {
        x,
        y,
      },
    }));
  };

  render() {
    const { children, menu, style, onRightClick, ...rest } = this.props;
    return (
      <div>
        {React.cloneElement(children, {
          onContextMenu: (event: MouseEvent) => {
            event.preventDefault();
            this.onRightClick(event.pageX, event.pageY);
            onRightClick(event);
          },
        })}
        {this.state.open && (
          <div
            ref={menu => {
              if (menu) {
                this.menuRef = menu;
              }
            }}
            style={{
              position: 'absolute',
              left: this.state.location.x,
              top: this.state.location.y,
              margin: 0,
              padding: 0,
              ...style,
            }}
            {...rest}
          >
            {menu}
          </div>
        )}
      </div>
    );
  }
}
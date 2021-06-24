
type Props = {a: "a"}
const Component = (props: Props) => {
  const a = props.a
  const b = a.b
  return <div/>
}

const Component2 = (props: Props) => {
  const a = props.a;
  const b = a.b;
  return <div />;
};

function Component2f(props: Props) {
  const a = props.a;
  const b = a.b;
  return <div />;
}

interface Props3 {
  a: 'b'
}
const Component3: React.FC<Props3> = (props ) => {
  const a = props.a
  const b = a.b
  return <div/>
}

const Component4 = (props: {a: 'c'}) => {
  const a = props.a
  const b = a.b
  return <div/>
}
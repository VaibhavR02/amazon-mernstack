import Alert from 'react-bootstrap/Alert';

export default function MessageBox(props) {
  return (
    <Alert
      className="m-3 text-center w-auto alert "
      variant={props.variant || 'info'}
    >
      {props.children}
    </Alert>
  );
}

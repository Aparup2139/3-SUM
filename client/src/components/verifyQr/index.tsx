import { useParams } from 'react-router-dom';

const VerifyQr = () => {
  const { bookingId } = useParams();
  return (
    <div className='w-full h-full bg-background'>
      Verify Qr Code Page: {bookingId}
    </div>
  )
}

export default VerifyQr

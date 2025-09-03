import { toast } from 'react-toastify';

export const confirmDialog = (message) => {
  return new Promise((resolve) => {
 toast.info(
      <div style={{ padding: '25px', minWidth: '500px' }}>
        <p style={{ 
          fontSize: '18px', 
          marginBottom: '25px', 
          fontWeight: '600',
          color: '#2c3e50',
          textAlign: 'center'
        }}>
          {message}
        </p>
        <div className="d-flex justify-content-end gap-4 mt-4">
          <button 
            style={{ 
              fontSize: '17px', 
              minWidth: '140px',
              padding: '10px 30px',
              backgroundColor: '#95a5a6',
              color: 'white',
              fontWeight: '500',
              transition: 'all 0.3s',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#7f8c8d'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#95a5a6'}
            onClick={() => {
              toast.dismiss();
              resolve(false);
            }}
          >
            Hủy
          </button>
          <button
            style={{ 
              fontSize: '17px', 
              minWidth: '140px',
              padding: '10px 30px',
              backgroundColor: '#3498db',
              color: 'white',
              fontWeight: '500',
              transition: 'all 0.3s',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(52, 152, 219, 0.3)'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#2980b9';
              e.target.style.boxShadow = '0 4px 12px rgba(52, 152, 219, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#3498db';
              e.target.style.boxShadow = '0 2px 8px rgba(52, 152, 219, 0.3)';
            }}
            onClick={() => {
              toast.dismiss();
              resolve(true);
            }}
          >
            Xác nhận
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        style: {
          maxWidth: '800px',
          width: '100%',
          backgroundColor: '#fff',
          boxShadow: '0 8px 20px rgba(52, 152, 219, 0.2)',
          borderRadius: '12px',
          border: '1px solid rgba(52, 152, 219, 0.1)',
          borderLeft: '5px solid #3498db',
          background: 'linear-gradient(to right bottom, #ffffff, #f8f9fa)'
        },
        className: 'd-flex justify-content-center w-100 m-auto'
      }
    );

  });
}; 
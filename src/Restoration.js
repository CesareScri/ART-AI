import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Restoration = () => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [urlImage, setUrlImage] = useState('');
  const [newurlImage, setNewUrlImage] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(null)

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('https://fz1.clipboard.cc/upload', formData, {
        onUploadProgress: (progressEvent) => {
          const progressPercentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(progressPercentage);
        },
      });

      const dataUrl = response.data.url;
      setUrlImage(dataUrl);
      console.log(dataUrl);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  useEffect(() => {
    if (file) {
      handleUpload();
    }
  }, [file]);

  const CreateIMG = ({ answer }) => {
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
      const intervalId = setInterval(async () => {
        try {
          const response = await fetch(`http://localhost:3001/v3/predictions/${answer}`);
          if (!response.ok) {
            throw new Error('Request failed');
          }

          const res = await response.json();

          if (res.status === 'succeeded') {
            const imageUrl = res.output; // Assuming the image source is available in res.output[0]

            setImageUrl(imageUrl);

            clearInterval(intervalId); // Clear the interval when the request succeeds
            setLoading(true);

            setError(false)
          } else if (res.status === 'failed'){
            clearInterval(intervalId);
            console.log('Error')
            setError(true)
          }
        } catch (error) {
          console.log('Error:', error.message);
          clearInterval(intervalId); // Clear the interval on error
        }
      }, 1000);

      return () => clearInterval(intervalId); // Clear the interval on component unmount
    }, [answer]);

    return (
      <div className='img-generated'>
        {imageUrl && <img src={imageUrl} alt='Generated' />}
      </div>
    );
  };

  const handleRequest = async () => {
    try {
      const data = { prompt: urlImage };
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      };

      const response = await fetch('http://localhost:3001/v3/predictions', options);
      if (!response.ok) {
        throw new Error('Request failed');
      }

      const res = await response.json();
      const answer = res.id; // Assuming the response provides the answer ID

      setNewUrlImage(answer);
    } catch (error) {
      console.log('Error:', error.message);
    }
  };

  return (
    <div className='res-parent'>
      <div className='res-input'>
        <h3>Input</h3>
        <div className='principale'>
          <h4 className='heading-img'>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-image" viewBox="0 0 16 16">
              <path d="M8.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
              <path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM3 2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v8l-2.083-2.083a.5.5 0 0 0-.76.063L8 11 5.835 9.7a.5.5 0 0 0-.611.076L3 12V2z" />
            </svg>img
          </h4>
          {progress === 100 ? <img className='img-show' src={urlImage} alt='Uploaded' /> : <img></img>}
          <label htmlFor='fileInput' className='drop-container'>
            <input id='fileInput' type='file' className='drop-input' onChange={handleFileChange} />
          </label>
          <div className='progress'>{progress > 0 && <div>Loading image: {progress}%</div>}</div>
        </div>

        <div className='image-option'>
          <h4 className='heading-img'>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-gear-fill" viewBox="0 0 16 16">
              <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z" />
            </svg>version
          </h4>
          <input type='text' value='v1.4' readOnly />
        </div>

        <div className='image-option'>
          <h4 className='heading-img'>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-zoom-in" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z" />
              <path d="M10.344 11.742c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1 6.538 6.538 0 0 1-1.398 1.4z" />
              <path fill-rule="evenodd" d="M6.5 3a.5.5 0 0 1 .5.5V6h2.5a.5.5 0 0 1 0 1H7v2.5a.5.5 0 0 1-1 0V7H3.5a.5.5 0 0 1 0-1H6V3.5a.5.5 0 0 1 .5-.5z" />
            </svg>scale
          </h4>
          <input type='text' value='2' readOnly />
        </div>

        <div className='button-submit'>
          <button onClick={handleRequest}>Submit</button>
        </div>
      </div>

      <div className='res-output'>
            <h3>Output</h3>
            {isError ? (
                <div className='err-msg'>Got error trying to upload output files</div>
            ) : isLoading ? (
                <h4 className='heading-img'>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-file-image"
                    viewBox="0 0 16 16"
                >
                    <path d="M8.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                    <path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM3 2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v8l-2.083-2.083a.5.5 0 0 0-.76.063L8 11 5.835 9.7a.5.5 0 0 0-.611.076L3 12V2z" />
                </svg>
                img result
                </h4>
            ) : null}
            {newurlImage && <CreateIMG answer={newurlImage} />}
            </div>

    </div>
  );
};

export default Restoration;

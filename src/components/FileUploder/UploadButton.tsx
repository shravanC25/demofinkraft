import React from 'react';
import { SizeInMB } from './SizeInMb';
import { IFile } from './Types';

interface IProps {
  UploadFunction: () => void;
  file: IFile[];
  loading: boolean;
  setFileDropZone: React.Dispatch<any>;
  progress: number;
  message: any;
  setMessage:React.Dispatch<any>;
}

function UploadButton({
  file,
  UploadFunction,
  loading,
  setFileDropZone,
  progress,
  message,
  setMessage,
}: IProps) {
  // Total Files Size
  const Size = file.reduce(
    (accumulator, object) => accumulator + object.size,
    0,
  );
  return (
    <>
      <div className="d-flex gap-2 justify-content-between py-2 px-4 border align-items-center mb-4 rounded flex-wrap">
        <i className="icon text-warning fas fa-file-upload" />
        <div className="text-wrap">
          {file.length > 1 ? `(${file.length}) Files` : `(${file.length}) File`}
          {' '}
          Selected
        </div>
        <p>
          Size:
          <strong>
            (
            {
              SizeInMB(Size)
            }
            )
          </strong>
        </p>
      </div>
      <div className="d-grid gap-2">
        {loading ? (
          <div className="progress barProgress">
            <div
              className="progress-bar"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              style={{
                width: `${progress}%`,
              }}
            >
              {progress}
              %
            </div>
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={UploadFunction}
              className="btn btn-primary py-2 rounded shadow"
            >
              <span>
                UPLOAD
                <i className="mx-4 fas fa-cloud-upload" />
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                setFileDropZone(null);
                setMessage([]);
              }}
              className="canceled btn flex-colo"
            >
              <p>Cancel</p>
            </button>
          </>
        )}
        {loading && message.length > 0 && (
          <div className="messageUpload mt-4 rounded">
            <ul>
              {message.map((item: any, i: any) => (
                <li className="text-success" key={i}>
                  <i className="fas fa-check-circle" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}

export default UploadButton;

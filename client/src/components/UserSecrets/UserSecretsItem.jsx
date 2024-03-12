import { useState, useEffect } from "react";

export default function UserSecretsItem({
  data,
  handleDelete,
  handleUpdate,
  error,
}) {
  const [value, setValue] = useState();
  const [isEditting, setIsEdditing] = useState();
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    if (data.new) {
      setIsNew(true);
    }
    setTimeout(() => {
      setIsNew(false);
    }, 1000);
    setIsEdditing(false);
  }, [data]);

  const handleClick = () => {
    setIsEdditing(true);
    setValue(data.secret_text);
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  }

  return (
    <li
      key={"secret-item-" + data.secret_id}
      className={`secret-item item-${data.secret_id} ${isNew ? "new" : ""}`}
    >
      <div className="secret-item-wrapper card p-3">
        {!isEditting ? (
          <p className="secret-text-item">{data.secret_text}</p>
        ) : (
          <textarea onChange={handleChange}
            className="secret-text-item form-control" value={value}
          >
          </textarea>
        )}
        <div className="mt-2">
          {!isEditting ? (
            <>
              <button
                onClick={handleClick}
                className="btn py-1 px-2 btn-warning"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-pencil"
                  viewBox="0 0 16 16"
                >
                  <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
                </svg>
              </button>
              <button
                onClick={() => {
                  return handleDelete(data.secret_id);
                }}
                className="btn py-1 px-2 btn-danger ml-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-trash"
                  viewBox="0 0 16 16"
                >
                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                  <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                </svg>
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                handleUpdate(data.secret_id, value);
              }}
              className="btn btn-dark"
            >
              Update
            </button>
          )}
        </div>
        {error && <span className="text-danger">{error}</span>}
      </div>
    </li>
  );
}

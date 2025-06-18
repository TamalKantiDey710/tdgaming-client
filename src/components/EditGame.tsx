import { useParams,useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {VideoGamesApi} from  '../api/VideoGamesApi';
import {VideoGame} from '../interfaces/VideoGame';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// const defaultGame: VideoGame = {
//     title: '',
//     price: 0,
//   };

  const schema = yup.object().shape({
    title: yup.string().required('Required'),
    price: yup
      .number()
      .typeError('Price must be a number')
      .min(0, 'Price must be at least 0')
      .required('Price is required'),
  });

export default function EditGame() {
  const { id } = useParams();
  // const [game, setGame] = useState<VideoGame>(defaultGame);
  const [error,setError] = useState<string|null>(null);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VideoGame>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if(!id) return;

    const fetchGame = async () => {
        try 
        {
          const data = await VideoGamesApi.getById(id);
          reset(data);
          setError(null);
        } 
        catch (err: any) 
        {
          setError(err.message || 'API Error');
        }
      };

      fetchGame();

  }, [id,reset]);

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setGame({ ...game, [e.target.name]: e.target.value });
  // };

   const handleBackClick = () => {
    navigate('/'); 
  };

  const onSubmit = async (data: VideoGame) => {
    try {
      if (id) {
        await VideoGamesApi.update(id, data);
      } else {
        await VideoGamesApi.create(data);
      }
      navigate('/');
    } catch (err: any) {
      alert(err.message || 'Failed to save game');
    }
  };

  const handleDelete = async () => {
  if (!id) return;

  const confirm = window.confirm('Are you sure you want to delete?');
  if (!confirm) return;

  try {
    await VideoGamesApi.delete(id);
    navigate('/');
  } catch (err: any) {debugger;
    alert(err.message || 'Failed to delete');
  }
};

  return (
    <div className="container">
      <h2>{id ? 'Edit Game' : 'Create Game'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="container mt-4">
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input {...register('title')} className="form-control" />
          {errors.title && <p style={{ color: 'red' }}>{errors.title.message}</p>}
        </div>
        <div className="mb-3">
          <label className="form-label">Price</label>
          <input type="number" step="0.01" {...register('price')}
            className="form-control"/>
        {errors.price && <p style={{ color: 'red' }}>{errors.price.message}</p>}
        </div>
        <div className="d-flex">
          <button className="btn btn-primary">{id ? 'Update' : 'Create'}</button>

          {id && (
            <button type="button" onClick={handleDelete} className="btn btn-danger ms-2">
              Delete
            </button>
          )}

          <button className="btn btn-secondary me-2" onClick={handleBackClick}>
            Back to List
          </button>

        </div>

      </form>
    </div>
  );
}

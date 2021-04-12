import { useEffect, useState} from 'react'

import {Header} from '../../components/Header';
import api from '../../services/api';
import {Food} from '../../components/Food';
import {ModalAddFood} from '../../components/ModalAddFood';
import {ModalEditFood} from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

interface FoodsFormat {
  id: number,
  name: string,
  description: string,
  price: string,
  image: string,
  available: boolean,
}

type AddFoodProps = Omit<FoodsFormat, 'id' | 'available'>
type EditFoodProps = Omit<FoodsFormat, 'id' | 'available'>



export function Dashboard()  {

  const [foods, setFoods] = useState<FoodsFormat[]>([])
  const [editingFood, setEditFoods] =useState<FoodsFormat>({} as FoodsFormat)
  const [openModal, setOpenModal ] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)

  useEffect(() => {
    async function getFood() { 
      const response = await api.get('/foods');
       setFoods(response.data);
      }
        getFood()
      },[])


  const handleAddFood = async (food: AddFoodProps):Promise<void> => {
    try {
      const response =  await api.post('/foods', {
        ...foods,
        avaliable: true
      });

      setFoods([...foods, response.data])
    } catch (error) {
      console.log(error);
    }
  }
    

 const  handleUpdateFood = async (food: EditFoodProps ):Promise<void> => {
  
    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food , }
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated);
    } catch (error) {
      console.log(error);
    }
  }

  const handleDeleteFood = async (id: number):Promise<void> => {
    
    await api.delete(`/foods/${id}`)

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods( foodsFiltered );
  }

  const toggleModal = () => {
    setOpenModal( !openModal );
  }

  const toggleEditModal = () => {

    setEditModalOpen( !editModalOpen );
  }

  const handleEditFood = (food: FoodsFormat) => {
    setEditFoods(food);
    setEditModalOpen(true);
  }

    return (
      <>
        <Header openModal={toggleModal} />
        <ModalAddFood
          isOpen={openModal}
          setIsOpen={toggleModal}
          handleAddFood={handleAddFood}
        />
        <ModalEditFood
          isOpen={editModalOpen}
          setIsOpen={toggleEditModal}
          editingFood={editingFood}
          handleUpdateFood={handleUpdateFood}
        />

        <FoodsContainer data-testid="foods-list">
          {foods &&
            foods.map(food => (
              <Food
                key={food.id}
                food={food}
                handleDelete={handleDeleteFood}
                handleEditFood={handleEditFood}
              />
            ))}
        </FoodsContainer>
      </>
    );
  }



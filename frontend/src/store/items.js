import { useEffect } from "react";
import { useDispatch } from "react-redux";

export const LOAD_ITEMS = "items/LOAD_ITEMS";
export const UPDATE_ITEM = "items/UPDATE_ITEM";
export const REMOVE_ITEM = "items/REMOVE_ITEM";
export const ADD_ITEM = "items/ADD_ITEM";

const load = (items, pokemonId) => ({
  type: LOAD_ITEMS,
  items,
  pokemonId
});

const update = (item) => ({
  type: UPDATE_ITEM,
  item
});

const add = (item) => ({
  type: ADD_ITEM,
  item
});

const remove = (itemId, pokemonId) => ({
  type: REMOVE_ITEM,
  itemId,
  pokemonId
});


export const getItems = (pokemon_id) => async dispatch => {
  const response = await fetch(`/api/pokemon/${pokemon_id}/items`);
  if (response.ok) {
    const items = await response.json();
    dispatch(load(items, pokemon_id));
  }
}

export const updateItem = (item) => {
  return fetch(`/api/items/${item.id}`, {
    method: 'PATCH',
    body: JSON.stringify(item),
    headers: {
      'Content-Type': "application/json",
      'Accept': "application/json"
    }
  })
}

export const editItem = (item) => async (dispatch, getState) => {
  const res = await updateItem(item)
  if (res.ok) {
    const data = await res.json();
    dispatch(update(data))
  }
}

export const deleteItem = (id) => {
  return fetch(`/api/items/${id}`, {
    method: 'DELETE',
    body: JSON.stringify(id),
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  })
}

export const removeItem = (id, pokemon_id) => async (dispatch, getState) => {
  const res = await deleteItem(id)
  if (res.ok) {
    const data = await res.json();
    dispatch(remove(data, pokemon_id))
  }
}
const initialState = {};

const itemsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_ITEMS:
      const newItems = {};
      action.items.forEach(item => {
        newItems[item.id] = item;
      })
      return {
        ...state,
        ...newItems
      }
    case REMOVE_ITEM:
      const newState = { ...state };
      delete newState[action.itemId];
      return newState;
    case ADD_ITEM:
    case UPDATE_ITEM:
      return {
        ...state,
        [action.item.id]: action.item
      };
    default:
      return state;
  }
};

export default itemsReducer;
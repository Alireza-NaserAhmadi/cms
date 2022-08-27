import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

export const actionTypes = {
  getAllSupportItems: "[getAllSupportItems] Action",
  addSupportItem: "[addSupportItem] Action",
  deleteSupportItem: "[deleteSupportItem] Action",
  editSupportItem: "[editSupportItem] Action",
};

const initialCountreiesState = {
  supportItems: [],
  isSupportItemsLoaded: false,
};

export const reducer = persistReducer(
  { storage, key: "v705-demo1-support-items", whitelist: ["user", "supportItems"] },
  (state = initialCountreiesState, action) => {
    switch (action.type) {
      case actionTypes.getAllSupportItems: {
        console.log("action.payload getAllSupportItems::::", action.payload);
        const {supportItems} = action.payload;
        return { supportItems, isSupportItemsLoaded: true };
      }

      case actionTypes.addSupportItem: {
        console.log("action.payload ::::", action.payload);
        const supportItem = action.payload;
        return {
          supportItems: initialCountreiesState.supportItems.push(supportItem),
          isSupportItemsLoaded: true,
        };
      }
      case actionTypes.editSupportItem: {
        console.log("action.payload ::::", action.payload);
        const supportItem = action.payload;
        return {
          supportItems: initialCountreiesState.supportItems.push(supportItem),
          isSupportItemsLoaded: true,
        };
      }
      case actionTypes.deleteSupportItem: {
        console.log("action.payload ::::", action.payload);
        const supportItem = action.payload;
        return {
          supportItems: initialCountreiesState.supportItems.push(supportItem),
          isSupportItemsLoaded: true,
        };
      }

      default:
        return state;
    }
  }
);

export const actions = {
  getAllSupportItems: (supportItems) => ({
    type: actionTypes.getAllSupportItems,
    payload: { supportItems },
  }),
  addSupportItem: (supportItem) => ({
    type: actionTypes.addSupportItem,
    payload: { supportItem },
  }),
  editSupportItem: (supportItem) => ({
    type: actionTypes.editSupportItem,
    payload: { supportItem },
  }),
  deleteSupportItem: (supportItem) => ({
    type: actionTypes.deleteSupportItem,
    payload: { supportItem },
  }),
};

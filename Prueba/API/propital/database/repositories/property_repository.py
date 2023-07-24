from typing import Any, Dict
from pymongo.database import Database
from pymongo.collection import Collection
from pymongo import ReturnDocument
from app.models import PropertyModel
from ..mongo_connection import db


class PropertyRepository:
    """
    Custom repository for interacting with the MongoDB database for Property data.

    This custom repository class provides methods to interact with the MongoDB database
    and perform various operations related to the Property data model.

    Attributes:
        collection (str): The name of the collection in the MongoDB database to be used for Property data.
        database (Database): The MongoDB database instance.

    Methods:
        __init__(self, collection: str):
            Initialize the PropertyRepository with the specified collection name.
        get_collection(self) -> Collection[PropertyModel]:
            Get the collection object for Property data in the database.
        find_one(self, query: Dict[str, Any]):
            Find a single document in the Property collection that matches the provided query.
        insert_one(self, data: PropertyModel) -> str:
            Insert a new Property document into the collection and return the inserted document's ID.
        get_by_id(self, id: str) -> PropertyModel:
            Find a Property document by its unique identifier (ID).
        update_one(self, query_filter, data, **args) -> PropertyModel:
            Update a Property document that matches the provided query filter with the specified data.
        delete_one(self, query_filer, **args):
            Delete a single Property document that matches the provided query filter.
        get_all(self) -> [PropertyModel]:
            Get all Property documents from the collection.
        get_all_by_tag(self, query: dict, **args) -> [PropertyModel]:
            Get Property documents from the collection that match the provided query.
    """

    collection: str
    database: Database = db

    def __init__(self, collection: str) -> Collection[PropertyModel]:
        """
        Initialize the PropertyRepository with the specified collection name.

        Args:
            collection (str): The name of the collection in the MongoDB database to be used for Property data.
        """
        self.collection = collection

    def get_collection(self):
        """
        Get the collection object for Property data in the database.

        Returns:
            Collection[PropertyModel]: The MongoDB collection object for Property data.
        """
        return self.database[self.collection]

    def find_one(self, query: Dict[str, Any]):
        """
        Find a single document in the Property collection that matches the provided query.

        Args:
            query (Dict[str, Any]): The query to find the matching document.

        Returns:
            Any: The matching document if found, otherwise None.
        """
        return self.database[self.collection].find_one(query)

    def insert_one(self, data: PropertyModel) -> str:
        """
        Insert a new Property document into the collection and return the inserted document's ID.

        Args:
            data (PropertyModel): The Property data to be inserted.

        Returns:
            str: The ID of the inserted document.
        """
        return self.database[self.collection].insert_one(data).inserted_id

    def get_by_id(self, id: str) -> PropertyModel:
        """
        Find a Property document by its unique identifier (ID).

        Args:
            id (str): The unique identifier (ID) of the Property document.

        Returns:
            PropertyModel: The Property document if found, otherwise None.
        """
        return self.database[self.collection].find({"id": id})

    def update_one(self, query_filter, data, **args) -> PropertyModel:
        """
        Update a Property document that matches the provided query filter with the specified data.

        Args:
            query_filter: The query filter to find the document to update.
            data: The data to be updated in the document.

        Returns:
            PropertyModel: The updated Property document.
        """
        return self.database[self.collection].find_one_and_update(
            query_filter,
            data,
            upsert=True,
            return_document=ReturnDocument.AFTER,
            **args
        )

    def delete_one(self, query_filer, **args):
        """
        Delete a single Property document that matches the provided query filter.

        Args:
            query_filter: The query filter to find the document to delete.
        """
        return self.database[self.collection].find_one_and_delete(query_filer, **args)

    def get_all(self) -> [PropertyModel]:
        """
        Get all Property documents from the collection.

        Returns:
            List[PropertyModel]: A list of all Property documents.
        """
        return self.database[self.collection].find({})

    def get_all_by_tag(self, query: dict, **args) -> [PropertyModel]:
        """
        Get Property documents from the collection that match the provided query.

        Args:
            query (dict): The query to filter the documents.

        Returns:
            List[PropertyModel]: A list of Property documents that match the query.
        """
        return self.database[self.collection].find({**query})

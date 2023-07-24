from pydantic import BaseModel, Field
from typing import Optional, List, Union, Tuple
from datetime import datetime


class QueryModel(BaseModel):
    """
    Pydantic model for representing query parameters used in property filtering.

    This Pydantic model class defines the structure of query parameters used for filtering properties.
    It allows developers to pass various filtering options as query parameters when making API requests.

    Attributes:
        id (Optional[int] | None): The property ID. Should be greater than or equal to 1.
        address (Optional[str] | None): The address of the property.
        max_price (Optional[float] | None): The maximum price of the property. Should be greater than or equal to 1.
        min_price (Optional[float] | None): The minimum price of the property. Should be greater than or equal to 1.
        max_bedrooms (Optional[int] | None): The maximum number of bedrooms in the property. Should be greater than or equal to 1.
        min_bedrooms (Optional[int] | None): The minimum number of bedrooms in the property. Should be greater than or equal to 1.
        max_bathrooms (Optional[int] | None): The maximum number of bathrooms in the property. Should be greater than or equal to 1.
        min_bathrooms (Optional[int] | None): The minimum number of bathrooms in the property. Should be greater than or equal to 1.
        min_size_sqft (Optional[int] | None): The minimum size of the property in square feet. Should be greater than or equal to 1.
        max_size_sqft (Optional[int] | None): The maximum size of the property in square feet. Should be greater than or equal to 1.
        location (Optional[Tuple[float, float]] | None): The location coordinates (latitude, longitude) of the property.
        terrain_type (Optional[str] | None): The type of terrain the property is located on.
        is_offer (Optional[bool] | None): A boolean flag indicating if the property is offered as a special offer.
        min_discount (Optional[float] | None): The minimum discount percentage applied to the property. Should be greater than or equal to 0.
        max_discount (Optional[float] | None): The maximum discount percentage applied to the property. Should be greater than or equal to 0.
        description (Optional[str] | None): A description keyword to filter properties by description.
        details (Optional[dict] | None): Additional details to filter properties by specific details.
        created_at (Optional[datetime] | None): The timestamp when the property record was created.
        updated_at (Optional[datetime] | None): The timestamp when the property record was last updated.

    Methods:
        __getitem__(self, name) -> str:
            Get the value of a specific attribute by its name.
    """

    id: Optional[int] | None = Field(ge=1, description="id greater at 1")
    address: Optional[str] | None = None
    max_price: Optional[float] | None = Field(
        ge=1, description="max price greater at 1"
    )
    min_price: Optional[float] | None = Field(
        ge=1, description="min price greater at 1"
    )
    max_bedrooms: Optional[int] | None = Field(
        ge=1, description="max number of bedrooms greater at 1"
    )
    min_bedrooms: Optional[int] | None = Field(
        ge=1, description="min number of bedrooms greater at 1"
    )
    max__bathrooms: Optional[int] | None = Field(
        ge=1, description="max number of bathrooms greater at 1"
    )
    min_bathrooms: Optional[int] | None = Field(
        ge=1, description="min number of bathrooms greater at 1"
    )
    min_size_sqft: Optional[int] | None = Field(
        ge=1, description="min size greater at 1"
    )
    max_size_sqft: Optional[int] | None = Field(
        ge=1, description="min number of bathrooms greater at 1"
    )
    location: Optional[Tuple[float, float]] | None = None
    terrain_type: Optional[str] | None = None
    is_offer: Optional[bool] | None = None
    min_discount: Optional[float] | None = Field(
        ge=0, description="min discount greater at 1"
    )
    max_discount: Optional[float] | None = Field(
        ge=0, description="max discount greater at 1"
    )
    description: Optional[str] | None = None
    details: Optional[dict] | None = None
    created_at: Optional[datetime] | None = None
    updated_at: Optional[datetime] | None = None

    def __getitem__(self, name) -> str:
        """
        Get the value of a specific attribute by its name.

        This method allows accessing the value of a specific attribute of the QueryModel
        by providing its name as a string.

        Args:
            name (str): The name of the attribute to retrieve.

        Returns:
            str: The value of the requested attribute.
        """
        return self.__getattribute__(name)

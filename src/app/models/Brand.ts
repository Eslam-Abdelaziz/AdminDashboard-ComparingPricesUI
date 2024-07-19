export interface Brand {
    numberOfResults:number;
    numberOfPages:number;
    mostMaxPrice:number;
    resultPaginated:{

        product_Id: number;
        product_Name_Local: string;
        product_Name_Global: string;
        product_Description_Local: string;
        product_Description_Global: string;
        addedDate: string;
        numberOfFavorites: number;
        averageRating: number;
        mostMinimumPrice: number;
        product_NumberOfClicks: number;
        brandPostDTO: {
            id: number;
            name_Local: string;
            name_Global: string;
            description_Local: string;
            description_Global: string;
            logo: string;
            logoUrl: string;
            categoryId: number;
        };
        subCategoryPostDTO: {
            id: number;
            name_Local: string;
            name_Global: string;
            categoryId: number;
        };
        productImageDTOs: {
            id: 1;
            prodId: 1;
            image: string;
        }[];
        productLinkDTOs: {
            link_Id: number;
            productLink: string;
            productDet_Name_Local: string;
            productDet_Name_Global: string;
            productDet_Description_Local: string;
            productDet_Description_Global: string;
            productDet_Price: number;
            productDet_Rating: number;
            productDet_isAvailable: boolean;
            lastUpdated: string;
            link_DomainId: number;
            domain_Logo: string;
            productSponsoredDTOs: {
                id: 1;
                cost: 100;
                startDate: string;
                duration: number;
                prodDetId: number;
            }[];
            domainDTO: {
                id: 1;
                name_Local: string;
                name_Global: string;
                description_Local: string;
                description_Global: string;
                url: string;
                logo: string;
            };
        }[];
    }[]
}

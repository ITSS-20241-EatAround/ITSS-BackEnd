package microservices.searchingapi.services;

import microservices.searchingapi.models.Restaurant;

import java.math.BigDecimal;
import java.util.List;

public class SearchService implements ISearchService{
    /**
     * Search a restaurant by name
     * @param name
     * @return
     */
    @Override
    public List<Restaurant> searchByName(String name) {
        return null;
    }

    @Override
    public List<Restaurant> searchByDistance(BigDecimal latitude, BigDecimal longitude) {
        return null;
    }

    @Override
    public List<Restaurant> searchByRating(BigDecimal rating) {
        return null;
    }
}

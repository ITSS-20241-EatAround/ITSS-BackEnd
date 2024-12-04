package microservices.searchingapi.services;

import microservices.searchingapi.models.Restaurant;

import java.math.BigDecimal;
import java.util.List;

public interface ISearchService {
    public List<Restaurant> searchByName(String name);
    public List<Restaurant> searchByDistance(BigDecimal latitude, BigDecimal longitude);
    public List<Restaurant> searchByRating(BigDecimal rating);
}

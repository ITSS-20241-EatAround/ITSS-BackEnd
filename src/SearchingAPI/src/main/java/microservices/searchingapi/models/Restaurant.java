package microservices.searchingapi.models;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class Restaurant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer restaurantId;
    private String name;
    private String address;
    private String contact;
    @Column(columnDefinition = "TEXT")
    private String menu;
    @Column(precision = 3, scale = 2)
    private BigDecimal rating;
    @Column(name = "image_url")
    private String imageUrl;
    @Column(precision = 9, scale = 6)
    private BigDecimal latitude;
    @Column(precision = 9, scale = 6)
    private BigDecimal longitude;

}

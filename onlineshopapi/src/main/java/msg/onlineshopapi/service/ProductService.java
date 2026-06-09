package msg.onlineshopapi.service;

import lombok.RequiredArgsConstructor;
import msg.onlineshopapi.exception.ResourceNotFoundException;
import msg.onlineshopapi.model.Product;
import msg.onlineshopapi.repository.ProductRepository;
import msg.onlineshopapi.repository.SupplierRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final SupplierRepository supplierRepository;

    public List<Product> findAll() {
        return productRepository.findAllWithRelations();
    }

    public Optional<Product> findById(UUID id) {
        return productRepository.findById(id);
    }

    public Product save(Product product) {
        validateSupplier(product);
        return productRepository.save(product);
    }

    public Product update(UUID id, Product product) {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        validateSupplier(product);
        existing.setName(product.getName());
        existing.setDescription(product.getDescription());
        existing.setPrice(product.getPrice());
        existing.setWeight(product.getWeight());
        existing.setCategory(product.getCategory());
        existing.setSupplier(product.getSupplier());
        existing.setImageUrl(product.getImageUrl());
        return productRepository.save(existing);
    }

    public void deleteById(UUID id) {
        productRepository.deleteById(id);
    }

    private void validateSupplier(Product product) {
        if (product.getSupplier() != null && product.getSupplier().getId() != null) {
            if (!supplierRepository.existsById(product.getSupplier().getId())) {
                throw new ResourceNotFoundException("Supplier not found with id: " + product.getSupplier().getId());
            }
        }
    }
}

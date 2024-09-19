package nl.duckstudios.pintandpillage.tests;

import nl.duckstudios.pintandpillage.entity.Village;
import nl.duckstudios.pintandpillage.entity.buildings.Lumberyard;
import nl.duckstudios.pintandpillage.model.ResourceType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class LumberYardTest {
    Village village;
    @BeforeEach
    public void setUp() {
        village = new Village();
    }

    @Test
    public void shouldIncreaseWoodWhenLumberyardIsBuiltAndActivated() {
        // Arrange
        initializeVillageWithResources(100, 1000);
        Lumberyard lumberyard = createLumberyard(100, 1, village);
        lumberyard.setLastCollected(LocalDateTime.now().minusHours(3));

        int woodBefore = village.getVillageResources().get(ResourceType.Wood.name());

        // Act
        lumberyard.collectResources();

        // Assert
        int woodAfter = village.getVillageResources().get(ResourceType.Wood.name());
        assertTrue(woodAfter > woodBefore);
    }

    // Helper method to initialize the village with starting resources and resource limit
    private void initializeVillageWithResources(int startingWood, int resourceLimit) {
        Map<String, Integer> resources = new HashMap<>();
        resources.put(ResourceType.Wood.name(), startingWood);
        village.setVillageResources(resources);
        village.setResourceLimit(resourceLimit);
    }

    // Helper method to create and set up a Lumberyard
    private Lumberyard createLumberyard(int resourcesPerHour, int level, Village village) {
        Lumberyard lumberyard = new Lumberyard();
        lumberyard.setResourcesPerHour(resourcesPerHour);
        lumberyard.setLevel(level);
        lumberyard.setGeneratesResource(ResourceType.Wood);
        lumberyard.setVillage(village);
        lumberyard.updateBuilding();
        return lumberyard;
    }
}

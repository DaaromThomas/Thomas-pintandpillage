package nl.duckstudios.pintandpillage.tests;

import nl.duckstudios.pintandpillage.Exceptions.BuildingConditionsNotMetException;
import nl.duckstudios.pintandpillage.buildings.MockBuilding;
import nl.duckstudios.pintandpillage.helper.ResourceManager;
import nl.duckstudios.pintandpillage.entity.Village;
import nl.duckstudios.pintandpillage.model.ResourceType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

public class BuildingTest {

    private MockBuilding building;
    private Village village;
    private ResourceManager resourceManager;

    @BeforeEach
    public void setup() {
        village = mock(Village.class);
        resourceManager = mock(ResourceManager.class);
        building = new MockBuilding();
        building.setVillage(this.village);
        building.setResourceManager(this.resourceManager);
    }


    //Function: levelUp()
    @Test
    public void should_return_BuildingConditionsNotMetException_when_not_enough_resources_available() {
        when(resourceManager.hasEnoughResourcesAvailable(eq(this.village), anyMap()))
                .thenReturn(false);

        assertThrows(BuildingConditionsNotMetException.class, () -> building.levelUp());
    }

    @Test
    public void should_return_BuildingConditionsNotMetException_when_village_does_not_have_enough_population() {
        when(resourceManager.hasEnoughResourcesAvailable(any(Village.class), anyMap())).thenReturn(true);
        when(village.hasEnoughPopulation(anyInt())).thenReturn(false);

        assertThrows(BuildingConditionsNotMetException.class, () -> building.levelUp());
    }

    @Test
    public void should_call_subtractResources_function_when_conditions_are_met() {
        //arrange
        Map<String, Integer> resourcesRequiredLevelUp = new HashMap<>();
        resourcesRequiredLevelUp.put(ResourceType.Wood.name(), 100);
        resourcesRequiredLevelUp.put(ResourceType.Stone.name(), 50);

        when(resourceManager.hasEnoughResourcesAvailable(any(Village.class), anyMap())).thenReturn(true);
        when(village.hasEnoughPopulation(anyInt())).thenReturn(true);

        building.setResourcesRequiredLevelUp(resourcesRequiredLevelUp);

        //act
        building.levelUp();

        //assert
        verify(resourceManager, times(1)).subtractResources(eq(village), anyMap());
    }
}

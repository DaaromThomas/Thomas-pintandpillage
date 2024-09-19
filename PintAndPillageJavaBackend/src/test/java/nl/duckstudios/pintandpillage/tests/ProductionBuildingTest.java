package nl.duckstudios.pintandpillage.tests;

import nl.duckstudios.pintandpillage.Exceptions.BuildingConditionsNotMetException;
import nl.duckstudios.pintandpillage.Exceptions.ProductionConditionsNotMetException;
import nl.duckstudios.pintandpillage.buildings.MockProductionBuilding;
import nl.duckstudios.pintandpillage.entity.Village;
import nl.duckstudios.pintandpillage.entity.production.Bow;
import nl.duckstudios.pintandpillage.entity.production.Unit;
import nl.duckstudios.pintandpillage.entity.researching.BowResearch;
import nl.duckstudios.pintandpillage.entity.researching.JarlResearch;
import nl.duckstudios.pintandpillage.entity.researching.Research;
import nl.duckstudios.pintandpillage.helper.ResourceManager;
import nl.duckstudios.pintandpillage.model.ResearchType;
import nl.duckstudios.pintandpillage.model.UnitType;
import nl.duckstudios.pintandpillage.model.Unlock;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

public class ProductionBuildingTest {

    private ResourceManager resourceManager;
    private MockProductionBuilding productionBuilding;
    private Village village;
    private Unit unit;

    @BeforeEach
    public void setUp() {
        // Initialize the resources and objects before each test
        resourceManager = new ResourceManager();
        village = mock(Village.class);

        productionBuilding = spy(new MockProductionBuilding());
        productionBuilding.setVillage(village);
        productionBuilding.setResourceManager(resourceManager);
        productionBuilding.setLevel(10);

        // Mock Unit behavior, using Bow as standard
        unit = mock(Unit.class);
        when(unit.getUnitName()).thenReturn(UnitType.Bow);
    }

    @Test
    public void shouldThrowProductionConditionsNotMetExceptionWhenUnitIsNotAllowedToBuild() {
        // Add Jarl to unlocks
        productionBuilding.setUnitsUnlockedAtLevel(List.of(new Unlock(UnitType.Jarl, 1)));
        when(unit.getResearchRequired()).thenReturn(ResearchType.Bow);

        // Catch the exception
        ProductionConditionsNotMetException exception = assertThrows(
                ProductionConditionsNotMetException.class,
                () -> productionBuilding.produceUnit(unit, 1)
        );

        // Verify the exception message
        assertEquals("Building can't produce unit", exception.getMessage());
    }

    //TODO: This test does not work
    @Test
    public void shouldThrowProductionConditionsNotMetExceptionWhenJarlResearchIsCompletedButBowIsNot() {
        // Add Bow to unlocks so the first if-statement won't fire
        productionBuilding.setUnitsUnlockedAtLevel(List.of(new Unlock(UnitType.Bow, 1)));

        when(village.getCompletedResearches()).thenReturn(List.of(new JarlResearch()));
        when(unit.getResearchRequired()).thenReturn(ResearchType.Bow);

        // Catch the exception
        ProductionConditionsNotMetException exception = assertThrows(
                ProductionConditionsNotMetException.class,
                () -> productionBuilding.produceUnit(new Bow(), 1)
        );

        // Verify the exception message
        assertEquals("Unit not researched", exception.getMessage());
    }

    @Test
    public void shouldNotThrowProductionConditionsNotMetExceptionWhenResearchTypeIsNoneAndResearchIsCompleted() {
        // Test case where no research is required for production
        when(unit.getResearchRequired()).thenReturn(ResearchType.None);
        productionBuilding.setUnitsUnlockedAtLevel(List.of(new Unlock(UnitType.Bow, 1)));

        // Skip the next if-statement
        when(this.village.hasEnoughPopulation(anyInt(), anyInt())).thenReturn(true);

        productionBuilding.produceUnit(unit, 1);
    }

    @Test
    public void shouldThrowProductionConditionsNotMetExceptionWhenUnitResearchIsNoneAndQueueIsFull() {
        // Mock Unit behavior for a unit requiring no research
        when(unit.getResearchRequired()).thenReturn(ResearchType.None);
        productionBuilding.setUnitsUnlockedAtLevel(List.of(new Unlock(UnitType.Bow, 1)));

        unit.populationRequiredPerUnit = 50;
        when(village.getPopulation()).thenReturn(10);  // Ensure this returns the mock value

        // Try adding another unit to the already full queue
        assertThrows(ProductionConditionsNotMetException.class, () -> {
            productionBuilding.produceUnit(unit, 1);
        });
    }
}

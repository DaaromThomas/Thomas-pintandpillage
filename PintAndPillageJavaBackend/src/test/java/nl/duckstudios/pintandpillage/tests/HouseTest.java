package nl.duckstudios.pintandpillage.tests;

import nl.duckstudios.pintandpillage.entity.Village;
import nl.duckstudios.pintandpillage.entity.buildings.Building;
import nl.duckstudios.pintandpillage.entity.buildings.House;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class HouseTest {

    private House house;

    @BeforeEach
    public void setUp() {
        Village village = new Village();
        house = new House();
        house.setVillage(village);
    }

    @Test
    public void testPopulationCapacityAtDifferentLevels() {
        house.setLevel(1);
        house.updateBuilding();
        assertEquals(21, house.getPopulationCapacity(), "Population capacity at level 1 should be 21");

        house.setLevel(2);
        house.updateBuilding();
        assertEquals(49, house.getPopulationCapacity(), "Population capacity at level 2 should be 49");

        house.setLevel(5);
        house.updateBuilding();
        assertTrue(house.getPopulationCapacity() > 31, "Population capacity at level 5 should be greater than 49");
    }

}

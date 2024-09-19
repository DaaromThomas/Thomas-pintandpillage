package nl.duckstudios.pintandpillage.tests;

import nl.duckstudios.pintandpillage.entity.Village;
import nl.duckstudios.pintandpillage.entity.buildings.House;
import nl.duckstudios.pintandpillage.entity.buildings.Lumberyard;
import nl.duckstudios.pintandpillage.model.ResourceType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class VillageTest {

    Village village;
    @BeforeEach
    public void setUp() {
        village = new Village();
    }


    //Population tests:
    @Test
    public void shouldIncreasePopulationWhenHouseIsBuildInVillage(){
        //arrange
        int before = village.getPopulation();
        House newHouse = new House();
        newHouse.setLevel(1);
        newHouse.updateBuilding();

        //act
        village.createBuilding(newHouse);

        //assert
        int after = village.getPopulation();

        assertEquals(21, after);
        assertTrue(before < after);
    }
}

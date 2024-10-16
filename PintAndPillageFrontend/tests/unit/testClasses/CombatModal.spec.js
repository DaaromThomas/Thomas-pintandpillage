// CombatModal.spec.js

import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import CombatModal from "@/components/ui/modals/CombatModal.vue";
import combatTestData from "../testData/test_combat_modal_data.json"; // Adjust the path to your test data

let wrapper;
let store;
let getters;
let localVue;

beforeAll(() => {
    localVue = createLocalVue();
    localVue.use(Vuex);
});

beforeEach(() => {
    const { unitsInVillage } = combatTestData;

    getters = {
        village: () => ({
            unitsInVillage
        })
    };

    store = new Vuex.Store({
        getters
    });

    wrapper = shallowMount(CombatModal, {
        store,
        localVue,
        propsData: {
            villageId: 1
        }
    });
});

afterEach(() => {
    wrapper.destroy();
});


describe("CombatModal.vue Component Tests", () => {
    it("shouldDisplayTheCorrectShipsBasedOnUnitsInTheVillage", () => {
        expect(wrapper.vm.ships).toHaveLength(1); // Only LongShip should be added
    });

    it("shouldDisplayTheCorrectUnitsAvailableInTheVillage", () => {
        expect(wrapper.vm.units).toHaveLength(1); // Only Warrior should be added
    });

    it("shouldShowTheCorrectErrorMessageWhenThereAreNoUnitsAvailable", async () => {
        getters.village.unitsInVillage = () => [];
        store = new Vuex.Store({ getters });
        wrapper = shallowMount(CombatModal, { store, localVue, propsData: { villageId: 1 } });

        const noUnitsText = wrapper.find("h2");
        expect(noUnitsText.text()).toBe("You currently don't have any units. Train some units to join the battlefields!");
    });

    it("shouldShowAnErrorWhenTryingToOpenUnitsFrameWithZeroCarryingCapacity", async () => {
        wrapper.vm.shipsDictionaryList = []; // No ships selected
        wrapper.vm.openUnitsFrame();

        expect(wrapper.vm.showErrorCarryingCapacity).toBe(true);
    });

    it("shouldSuccessfullyAddShipsAndDisplayCarryingCapacity", async () => {
        wrapper.vm.inputValues[0] = 2;
        await wrapper.vm.addShips("LongShip", 10, 0);

        expect(wrapper.vm.shipsDictionaryList).toHaveLength(1);
        expect(wrapper.vm.shipsDictionaryList[0]).toEqual({
            shipType: "LongShip",
            shipCarryingCapacity: 10,
            shipsAmount: 2,
        });

        expect(wrapper.vm.totalCarryingCapacity()).toBe(20); // 2 ships * 10 capacity
    });

    it("shouldSuccessfullyAddUnitsAndUpdateUnitsDictionaryList", async () => {
        wrapper.vm.inputValues[0] = 3;
        await wrapper.vm.addUnit("Warrior", 0);

        expect(wrapper.vm.unitsDictionaryList).toHaveLength(1);
        expect(wrapper.vm.unitsDictionaryList[0]).toEqual({
            unitType: "Warrior",
            amount: 3,
        });
    });

    it("shouldDisplayAnErrorWhenStartingTheAttackWithNoUnitsSelected", async () => {
        wrapper.vm.unitsDictionaryList = [];
        await wrapper.vm.startAttack();

        expect(wrapper.vm.showErrorNoUnitsSelected).toBe(true);
    });

    it("shouldCalculateTheTotalUnitsSelectedCorrectly", async () => {
        wrapper.vm.unitsDictionaryList = [
            { unitType: 'Warrior', amount: 3 },
            { unitType: 'Archer', amount: 2 },
        ];

        const totalUnits = wrapper.vm.totalUnitsSelected();

        expect(totalUnits).toBe(5); // 3 warriors + 2 archers
    });

    it("shouldCalculateTheTotalCarryingCapacityCorrectly", async () => {
        wrapper.vm.shipsDictionaryList = [
            { shipType: 'LongShip', shipsAmount: 2, shipCarryingCapacity: 10 },
            { shipType: 'CombatShip', shipsAmount: 1, shipCarryingCapacity: 20 },
        ];

        const totalCapacity = wrapper.vm.totalCarryingCapacity();

        expect(totalCapacity).toBe(40); // 2 * 10 long-ships + 1 * 20 combat-ships
    });
});
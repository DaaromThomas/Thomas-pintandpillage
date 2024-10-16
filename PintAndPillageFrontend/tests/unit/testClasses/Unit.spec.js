import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";

import unitTestData from "../testData/test_unit_data.json";
import Unit from "@/components/ui/barracks/Unit.vue";

let unitWrapper;
let store;
let getters;
let localVue;

beforeAll(() => {
    localVue = createLocalVue();
    localVue.use(Vuex);
});

beforeEach(() => {
    const { village, unit, building, unitUnlockList } = unitTestData;

    getters = {
        village: () => village,
    };

    store = new Vuex.Store({
        getters,
    });

    unitWrapper = shallowMount(Unit, {
        store,
        localVue,
        propsData: {
            unit: unit,
            building: building,
            unitUnlockList: unitUnlockList,
        },
    });
});

afterEach(() => {
    unitWrapper.destroy();
});

describe("Unit.vue Component Tests", () => {
    it("shouldDisplayTheCorrectUnitNameAndDescription", () => {
        const unitName = unitWrapper.find("#unit-name").text();
        const unitDescription = unitWrapper.find("#unit-description").text();

        expect(unitName).toBe("Scout");
        expect(unitDescription).toBe("A melee combat unit.");
    });

    it("shouldDisplayTheCorrectUnitStats", () => {
        const statsText = unitWrapper.find("#unit-stats").text();
        const expectedText = "Attack: 15 - Defence: 10 - Health: 100 - Speed: 1";

        expect(statsText).toBe(expectedText);
    });

    it("shouldDisplayTheCorrectUnitAmountInStore", () => {
        const unitsInStore = unitWrapper.find("#unit-amount").text();
        expect(unitsInStore).toBe("10");
    });

    it("shouldEnableSliderAndInputIfTheUnitCanBeRecruited", () => {
        expect(unitWrapper.find("#unit-slider").attributes("disabled")).toBe(undefined);
        expect(unitWrapper.find("#unit-input").attributes("disabled")).toBe(undefined);
    });

    it("shouldDisableSliderAndInputIfRecruitmentIsNotPossible", async () => {
        await unitWrapper.setProps({
            building: { name: "Barracks", level: 1, buildingId: 1 },
            unitUnlockList: [{ unitType: "Scout", level: 3 }],
        });

        expect(unitWrapper.find("#unit-slider").attributes("disabled")).toBe("disabled");
        expect(unitWrapper.find("#unit-input").attributes("disabled")).toBe("disabled");
    });

    it("shouldDisplayCorrectLevelRequirementMessage", async () => {
        await unitWrapper.setProps({
            building: { name: "Barracks", level: 1, buildingId: 1 },
            unitUnlockList: [{ unitType: "Scout", level: 3 }],
        });

        const levelRequirementMessage = unitWrapper.find("#unit-level-requirement").text();
        expect(levelRequirementMessage).toBe("Unit requires Barracks level 3");
    });

    it("shouldComputeTheCorrectMaximumUnitsToProduce", () => {
        const maxUnits = unitWrapper.vm.unitMaxProduce;
        expect(maxUnits).toBe(20);
    });

    it("shouldUpdateTheSliderValueCorrectlyOnInput", async () => {
        const slider = unitWrapper.find("#unit-slider");
        await slider.setValue(5);

        expect(unitWrapper.vm.sliderValue).toBe("5");
    });

    it("shouldUpdateTheNumberInputValueCorrectlyOnInput", async () => {
        const numberInput = unitWrapper.find("#unit-input");
        await numberInput.setValue(3);

        expect(unitWrapper.vm.sliderValue).toBe("3");
    });

    it("shouldDisplayTheCorrectTrainingButtonText", () => {
        const buttonText = unitWrapper.find("#train-button").text();
        expect(buttonText).toBe("Train");
    });
});
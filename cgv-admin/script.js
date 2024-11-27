"use strict";
//Lấy danh sách thú cưng từ localStorage
let petList = JSON.parse(getFromStorage("petList", "[]"));
//Lấy danh sách Breed từ localStorage
let breedArr = JSON.parse(getFromStorage("breedArr", "[]"));

//Lấy các DOM element
const submitBtn = document.getElementById("submit-btn");
const healthyBtn = document.getElementById("healthy-btn");
const calculateBMIBtn = document.getElementById("calculate-bmi-btn");
const idInput = document.getElementById("input-id");
const nameInput = document.getElementById("input-name");
const ageInput = document.getElementById("input-age");
const typeInput = document.getElementById("input-type");
const weightInput = document.getElementById("input-weight");
const lengthInput = document.getElementById("input-length");
const colorInput = document.getElementById("input-color-1");
const breedInput = document.getElementById("input-breed");

const tableBodyEl = document.getElementById("tbody"); //id của thân bảng

if (tableBodyEl) {
  renderTableData(petList); //Hiển thị thông tin bảng mỗi lần tải lại trang
  // renderBreed(breedArr);
}

//Hàm validate pet data
const validatePetData = function (data) {
  //Kiểm tra dữ liệu không được bỏ trống
  if (
    !data.id ||
    !data.name ||
    !data.age ||
    !data.type ||
    !data.weight ||
    !data.length ||
    !data.color ||
    !data.breed
  ) {
    alert("All fields are required!");
    return false;
  }

  //Kiểm tra ID không được trùng lặp
  if (petList.some((pet) => pet.id === data.id)) {
    //pet đại diện cho từng phẩn từ trong mảng pestList
    alert("ID must be unique!");
    return false;
  }

  //Kiểm tra age trong khoảng 1-15
  if (data.age < 1 || data.age > 15) {
    alert("Age must be between 1 and 15!");
    return false;
  }

  //Kiểm tra weight trong khoảng 1-15
  if (data.weight < 1 || data.weight > 15) {
    alert("Weight must be between 1 and 15!");
    return false;
  }

  //Kiểm tra length trong khoảng 1-100
  if (data.length < 1 || data.length > 100) {
    alert("Length must be between 1 and 100!");
    return false;
  }

  //Kiểm tra trường Type phải được chọn
  if (data.type === "Select Type" || data.type === "") {
    alert("Please select Type!");
    return false;
  }

  //Kiểm tra trường Breed phải được chọn
  if (data.breed === "Select Breed" || data.breed === "") {
    alert("Please select Breed!");
    return false;
  }

  return true;
};

//Hàm hiển thị danh sách thú cưng lên bảng
function renderTableData(petList) {
  // Xóa toàn bộ nội dung của bảng
  tableBodyEl.innerHTML = "";

  // Duyệt qua mảng petArr để tạo hàng cho từng thú cưng
  petList.forEach((pet) => {
    // Chuyển thuộc tính dateAdded từ chuỗi về đối tượng Date
    pet.dateAdded = new Date(pet.dateAdded);

    const row = document.createElement("tr");

    // Tạo nội dung HTML cho hàng bằng Template String
    row.innerHTML = `
        <th scope="row">${pet.id}</th>
				<td>${pet.name}</td>
				<td>${pet.age}</td>
				<td>${pet.type}</td>
				<td>${pet.weight} kg</td>
				<td>${pet.length} cm</td>
				<td>${pet.breed}</td>
				<td>
						<i class="bi bi-square-fill" style="color: ${pet.color}"></i>
				</td>
				<td>${pet.dateAdded.getDate()}/${
      pet.dateAdded.getMonth() + 1
    }/${pet.dateAdded.getFullYear()}</td>
				<td>
        <button data-bs-toggle="modal"
            data-bs-target="#exampleModal" type="button" class="btn btn-warning" onclick="startEditPet('${
              pet.id
            }')">Edit</button>
        <button type="button" class="btn btn-danger" onclick="deletePet('${
          pet.id
        }')">Delete</button>
				</td>
    `;

    // Thêm hàng vào bảng
    tableBodyEl.appendChild(row);
  });
}

//Hàm Xóa các dữ liệu vừa nhập trên Form
const clearInput = () => {
  idInput.value = "";
  typeInput.value = "Select Type";
  // vaccinatedInput.checked = false;
  nameInput.value = "";
  ageInput.value = "";
  weightInput.value = "";
  lengthInput.value = "";
  colorInput.value = "#000000";
  breedInput.value = "Select Breed";
  // dewormedInput.checked = false;
  // sterilizedInput.checked = false;

  //Đặt lại trạng thái cho nút Caculate Bmi
  // resetCalculateBMIBtn();

  //Đặt lại trạng thái cho nút Show Healthy Pet
  // resetHealthyBtn();
};

//Hàm edit pet
const startEditPet = (petId) => {
  // Tìm thú cưng trong mảng dựa vào ID
  const pet = petList.find((p) => p.id === petId);

  // Tìm thấy thú cưng, Hiển thị thông tin của nó lên bảng
  if (pet) {
    idInput.value = pet.id; //Cố định phần ID cho input đầu vào, hiển thị thông tin hiện tại của pet
    typeInput.value = pet.type;
    nameInput.value = pet.name;
    ageInput.value = pet.age;
    weightInput.value = pet.weight;
    lengthInput.value = pet.length;
    colorInput.value = pet.color;
    breedInput.value = pet.breed;

    renderBreed(breedArr);
    //Xóa class active khỏi form để hiển thị bảng chỉnh sửa
    editForm.classList.remove("active");
  } else {
    console.log("Pet not found!");
  }
};

//Hàm delete pet khỏi mảng, cập nhật lại bảng
const deletePet = (petId) => {
  // Confirm before deleting the pet
  if (confirm("Are you sure?")) {
    // Tìm vị trí của thú cưng trong mảng dựa vào ID
    const petIndex = petList.findIndex((pet) => pet.id === petId);

    // Nếu tìm thấy thú cưng, xóa nó khỏi mảng
    if (petIndex !== -1) {
      petList.splice(petIndex, 1); // Xóa 1 phần tử tại vị trí petIndex
      //Lưu petList xuống LocalStorage
      saveToStorage("petList", JSON.stringify(petList));
      ///
      renderTableData(petList); // Reload lại bảng sau khi xóa
      // resetHealthyBtn();
      // resetCalculateBMIBtn();
    } else {
      console.log("Pet not found!");
    }
  }
};

//Bắt sự kiện Click trên nút "Submit"
if (submitBtn) {
  submitBtn.addEventListener("click", function (e) {
    e.preventDefault(); //Ngăn chặn form submit mặc định nếu có

    //Lấy dữ liệu từ các input
    const petData = {
      id: idInput.value,
      name: nameInput.value,
      age: ageInput.value,
      type: typeInput.value,
      weight: weightInput.value,
      length: lengthInput.value,
      color: colorInput.value,
      breed: breedInput.value,
      // vaccinated: vaccinatedInput.checked,
      // dewormed: dewormedInput.checked,
      // sterilized: sterilizedInput.checked,
      dateAdded: new Date(),
    };

    //Validate dữ liệu
    const validate = validatePetData(petData);
    console.log(petData); // In ra để kiểm tra dữ liệu đầu vào

    // Thêm thú cưng vào danh sách khi dữ liệu hợp lệ
    if (validate) {
      petList.push(petData);
      //Lưu petList xuống LocalStorage
      saveToStorage("petList", JSON.stringify(petList));
      //Thiết lập lại giao diện web
      clearInput();
      renderTableData(petList);
    }
  });
}

// Hàm lọc và hiển thị thú cưng khỏe mạnh
// function toggleHealthyPet() {
//   if (!healthyCheck) {
//     // Nếu đang ở chế độ hiển thị tất cả thú cưng, chuyển sang chỉ hiển thị thú cưng khỏe mạnh
//     const healthyPetList = petList.filter(
//       (pet) => pet.vaccinated && pet.dewormed && pet.sterilized
//     );
//     renderTableData(healthyPetList); // Hiển thị chỉ thú cưng khỏe mạnh
//     healthyBtn.textContent = "Show All Pet"; // Đổi tên nút
//     //Đặt lại trạng thái cho nút Caculate Bmi
//     // resetCalculateBMIBtn();
//   } else {
//     // Nếu đang ở chế độ chỉ hiển thị thú cưng khỏe mạnh, chuyển sang hiển thị tất cả thú cưng
//     renderTableData(petList); // Hiển thị toàn bộ thú cưng
//     healthyBtn.textContent = "Show Healthy Pet"; // Đổi tên nút
//     //Đặt lại trạng thái cho nút Caculate Bmi
//     // resetCalculateBMIBtn();
//   }
//   healthyCheck = !healthyCheck; // Đổi trạng thái healthyCheck
// }

// // Bắt sự kiện click vào nút để chuyển đổi giữa hai chế độ
// if (healthyBtn) {
//   healthyBtn.addEventListener("click", toggleHealthyPet);
// }

//Hàm tính toán BMI
function calculateBMI(petDataList) {
  if (!showBMI) {
    // Nếu đang ở ko hiển thị BMI thì
    petDataList.forEach((pet) => {
      if (pet.type === "Dog") {
        document.getElementById(`bmi-${pet.id}`).textContent = (
          (pet.weight * 703) /
          pet.length ** 2
        ).toFixed(2);
      }
      if (pet.type === "Cat") {
        document.getElementById(`bmi-${pet.id}`).textContent = (
          (pet.weight * 886) /
          pet.length ** 2
        ).toFixed(2);
      }
    });
    calculateBMIBtn.textContent = "Hide BMI"; // Đổi tên nút
  } else {
    // Nếu đang ở hiển thị BMI thì
    petDataList.forEach((pet) => {
      document.getElementById(`bmi-${pet.id}`).textContent = "?";
    });
    calculateBMIBtn.textContent = "Calculate BMI"; // Đổi tên nút
  }
  showBMI = !showBMI; // Đổi trạng thái showBMI
}

// Bắt sự kiện click vào nút để chuyển đổi giữa hai chế độ
if (calculateBMIBtn) {
  calculateBMIBtn.addEventListener("click", function () {
    if (healthyCheck) {
      const healthyPetList = petList.filter(
        (pet) => pet.vaccinated && pet.dewormed && pet.sterilized
      );
      renderTableData(healthyPetList); // Hiển thị chỉ thú cưng khỏe mạnh
      calculateBMI(healthyPetList);
    } else {
      calculateBMI(petList);
    }
  });
}

/*** ASM 02***/

//Thêm animation khi người dùng click vào navbar

const sidebarEl = document.getElementById("sidebar");
if (sidebarEl) {
  sidebarEl.addEventListener("click", function () {
    sidebarEl.classList.toggle("active");
  });
}

var myModal = new bootstrap.Modal(document.getElementById("exampleModal"), {
  backdrop: "static",
  keyboard: false, // Ngăn việc đóng modal bằng phím Esc
});

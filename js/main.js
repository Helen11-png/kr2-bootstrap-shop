// main.js — небольшие сценарии поверх Bootstrap.
// Сам Bootstrap (меню, модальное окно, accordion, tabs, carousel, toast) работает через bootstrap.bundle.min.js.
(function () {
  'use strict';

  // ---------- 1. Маска телефона: +7 (900) 000-00-00 ----------
  function formatPhone(value) {
    var digits = value.replace(/\D/g, '');
    if (digits.charAt(0) === '7' || digits.charAt(0) === '8') {
      digits = digits.slice(1);
    }
    digits = digits.slice(0, 10);

    var result = '+7';
    if (digits.length > 0) result += ' (' + digits.slice(0, 3);
    if (digits.length > 3) result += ') ' + digits.slice(3, 6);
    if (digits.length > 6) result += '-' + digits.slice(6, 8);
    if (digits.length > 8) result += '-' + digits.slice(8, 10);
    return result;
  }

  document.querySelectorAll('input[data-phone]').forEach(function (input) {
    input.addEventListener('input', function () {
      input.value = input.value === '' ? '' : formatPhone(input.value);
    });
  });

  // ---------- 2. Валидация форм (классы Bootstrap needs-validation) ----------
  var toastEl = document.getElementById('successToast');

  document.querySelectorAll('form.needs-validation').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      if (!form.checkValidity()) {
        event.stopPropagation();
        form.classList.add('was-validated');
        return;
      }

      // Данные никуда не отправляются: проект учебный, сервера нет.
      var successBox = form.parentElement.querySelector('.form-success');
      if (successBox) successBox.classList.remove('d-none');

      var modalEl = form.closest('.modal');
      if (modalEl) bootstrap.Modal.getInstance(modalEl).hide();

      if (toastEl) bootstrap.Toast.getOrCreateInstance(toastEl).show();

      form.reset();
      form.classList.remove('was-validated');
    });

    form.addEventListener('reset', function () {
      form.classList.remove('was-validated');
    });
  });

  // ---------- 3. Модальное окно: подставляем курс из кнопки ----------
  var orderModal = document.getElementById('orderModal');
  if (orderModal) {
    orderModal.addEventListener('show.bs.modal', function (event) {
      var button = event.relatedTarget;
      var select = orderModal.querySelector('select');
      if (button && button.dataset.course && select) {
        select.value = button.dataset.course;
      }
    });
  }

  // ---------- 4. Страница заявки: предмет из ссылки ?course=math и минимальная дата ----------
  var orderCourse = document.getElementById('order-course');
  if (orderCourse) {
    var course = new URLSearchParams(window.location.search).get('course');
    if (course && orderCourse.querySelector('option[value="' + course + '"]')) {
      orderCourse.value = course;
    }
  }

  var dateInput = document.getElementById('order-date');
  if (dateInput) {
    dateInput.min = new Date().toLocaleDateString('sv'); // формат ГГГГ-ММ-ДД
  }
})();

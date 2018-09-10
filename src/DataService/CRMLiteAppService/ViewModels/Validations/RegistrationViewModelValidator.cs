
using FluentValidation;

namespace CRMLiteAppService.ViewModels.Validations
{
    public class RegistrationViewModelValidator : AbstractValidator<RegistrationViewModel>
    {
        public RegistrationViewModelValidator()
        {
            RuleFor(vm => vm.Email).EmailAddress();
            RuleFor(vm => vm.Email).NotEmpty();
            RuleFor(vm => vm.Password).NotEmpty();
			RuleFor(vm => vm.Password).Length(6, 12);
            RuleFor(vm => vm.ConfirmPassword).Equal(vm => vm.Password).WithMessage("'ConfirmPassword' deve ser igual a 'Password'");
        }
    }
}

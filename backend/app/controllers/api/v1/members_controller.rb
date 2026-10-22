class Api::V1::MembersController < Api::BaseController
  def index
    members = Member.order(:name)

    members = members.where("name LIKE ?", "%#{params[:search]}%") if params[:search].present?
    members = members.where(department: params[:department]) if params[:department].present?
    members = members.where(year: params[:year]) if params[:year].present?
    members = members.where(status: params[:status]) if params[:status].present?

    render json: members.as_json(except: [:password_digest])
  end

  def show
    member = Member.find(params[:id])
    render json: member.as_json(except: [:password_digest])
  end

  def create
    require_admin
    return if performed?

    member = Member.new(member_params)

    if member.save
      render json: member.as_json(except: [:password_digest]), status: :created
    else
      render json: { errors: member.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    require_admin
    return if performed?

    member = Member.find(params[:id])

    if member.update(member_params)
      render json: member.as_json(except: [:password_digest])
    else
      render json: { errors: member.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    require_admin
    return if performed?

    Member.find(params[:id]).destroy!
    head :no_content
  end

  private

  def member_params
    params.require(:member).permit(
      :name, :email, :department, :year, :role, :status, :password
    )
  end
end

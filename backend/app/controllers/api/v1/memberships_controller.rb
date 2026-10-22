class Api::V1::MembershipsController < Api::BaseController
  def index
    memberships = Membership.includes(:member, :team)

    render json: memberships.as_json(
      include: {
        member: { only: [:id, :name, :email] },
        team: { only: [:id, :name] }
      }
    )
  end

  def create
    return unless require_admin

    membership = Membership.new(membership_params)

    if membership.save
      render json: membership, status: :created
    else
      render json: { errors: membership.errors.full_messages },
             status: :unprocessable_entity
    end
  end

  def destroy
    return unless require_admin

    Membership.find(params[:id]).destroy!
    head :no_content
  end

  private

  def membership_params
    params.require(:membership).permit(:member_id, :team_id, :designation)
  end
end
